// 模板数据统一服务层
// 处理 API 请求、响应解析、字段映射（后端英文字段 → 前端中文展示）

// ===== 常量与映射 =====

// 后端 category（英文）→ 前端 style（中文）
const CATEGORY_MAP = {
  simple: '简约',
  professional: '专业',
  creative: '创意',
  tech: '技术岗',
  management: '管理岗',
};

// 后端 language（英文）→ 前端 language（中文）
const LANGUAGE_MAP = {
  chinese: '中文',
  english: '英文',
};

// 从 templateStyles.js 导入所有模板
import { ALL_TEMPLATES } from './templateStyles.js'

// 模拟数据使用统一的模板列表
const MOCK_TEMPLATES = ALL_TEMPLATES

// ===== 工具函数 =====

// 字段映射：后端格式 → 前端展示格式
export function mapTemplateFields(tpl) {
  if (!tpl || typeof tpl !== 'object') return null;

  const category = tpl.category || tpl.style;
  const language = tpl.language;

  // category/style → 中文风格名
  let styleDisplay;
  if (CATEGORY_MAP[category]) {
    styleDisplay = CATEGORY_MAP[category];
  } else if (typeof category === 'string' && category.trim()) {
    styleDisplay = category; // 已经是中文或其他值，原样展示
  } else {
    styleDisplay = '其他';
  }

  // language → 中文显示名
  let languageDisplay;
  if (LANGUAGE_MAP[language]) {
    languageDisplay = LANGUAGE_MAP[language];
  } else if (typeof language === 'string' && language.trim()) {
    languageDisplay = language; // 已经是中文或其他值
  } else {
    languageDisplay = '中文'; // 默认值
  }

  // is_pro → 布尔值
  const isPro = tpl.is_pro === true || tpl.is_pro === 1 || tpl.is_pro === '1' || tpl.is_pro === 'true';

  // 从 style_data 字段解析额外信息（后端数据库存储的JSON）
  let variantId = tpl.variantId;
  let hasPhoto = tpl.hasPhoto;
  let photoPosition = tpl.photoPosition;
  
  if (tpl.style_data && typeof tpl.style_data === 'string') {
    try {
      const styleData = JSON.parse(tpl.style_data);
      if (styleData.variantId) variantId = styleData.variantId;
      if (styleData.hasPhoto !== undefined) hasPhoto = styleData.hasPhoto;
      if (styleData.photoPosition) photoPosition = styleData.photoPosition;
    } catch (e) {
      console.warn('[mapTemplateFields] 解析 style_data 失败:', e.message);
    }
  }

  // 返回包含原字段和映射后字段的对象（兼容两种访问方式）
  return {
    ...tpl,
    style: styleDisplay,
    category: styleDisplay,
    language: languageDisplay,
    is_pro: isPro,
    isPro,
    download_count: tpl.download_count || tpl.downloadCount || 0,
    variantId,
    hasPhoto: hasPhoto !== undefined ? hasPhoto : true,
    photoPosition,
  };
}

// 响应解析：处理后端 { code, message, data } 格式，正确提取 templates 数组或单个 template
export function parseApiResponse(data) {
  if (!data) return null;

  // data 可能是整个响应对象 { code, message, data: { templates, pagination } }
  // 也可能内层 data 已经被提取出来 { templates, pagination }
  // 也可能直接是模板数组

  if (Array.isArray(data)) {
    return data.map(mapTemplateFields);
  }

  if (data.data && typeof data.data === 'object') {
    // 外层是响应对象，data 是内层数据
    const inner = data.data;

    if (inner.templates !== undefined) {
      return inner.templates.map(mapTemplateFields);
    }
    if (inner.template !== undefined) {
      return mapTemplateFields(inner.template);
    }
    if (Array.isArray(inner)) {
      return inner.map(mapTemplateFields);
    }
    if (typeof inner === 'object') {
      return mapTemplateFields(inner);
    }
  }

  // data 本身是内层数据对象（已经被提取过 data.data）
  if (data.templates !== undefined) {
    return data.templates.map(mapTemplateFields);
  }
  if (data.template !== undefined) {
    return mapTemplateFields(data.template);
  }
  if (data.name !== undefined || data.category !== undefined) {
    // 单个模板对象
    return mapTemplateFields(data);
  }

  return null;
}

// 带超时的 fetch 包装
async function fetchWithTimeout(url, options = {}, timeout = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('请求超时，请检查网络连接后重试');
    }
    throw error;
  }
}

// ===== API 函数 =====

// 获取模板列表
// params: { search, style, language, type, limit }
export async function fetchTemplateList(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.style && params.style !== 'all') query.set('style', params.style);
    if (params.language && params.language !== 'all') query.set('language', params.language);
    if (params.type && params.type !== 'all') query.set('type', params.type);
    if (params.limit) query.set('limit', params.limit);

    const url = `/api/templates${query.toString() ? '?' + query.toString() : ''}`;

    const res = await fetchWithTimeout(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const result = parseApiResponse(data);

    if (result === null || result === undefined) {
      return { templates: [], pagination: null, fromApi: true };
    }

    if (!Array.isArray(result)) {
      // parseApiResponse 返回了单个对象（异常情况），转为数组
      return { templates: [result], pagination: null, fromApi: true };
    }

    // 提取 pagination（如果有的话）
    let pagination = null;
    if (data && data.data && data.data.pagination) {
      pagination = data.data.pagination;
    } else if (data && data.pagination) {
      pagination = data.pagination;
    }

    return { templates: result, pagination, fromApi: true };
  } catch (err) {
    console.error('[fetchTemplateList] API 请求失败:', err.message);
    // 降级到模拟数据
    const fallback = MOCK_TEMPLATES.map(mapTemplateFields);

    // 如果有筛选条件，在模拟数据中做简单过滤
    let filtered = fallback;
    if (params.search) {
      const kw = String(params.search).toLowerCase();
      filtered = filtered.filter((t) => t.name && t.name.toLowerCase().includes(kw));
    }
    if (params.style && params.style !== 'all') {
      filtered = filtered.filter((t) => t.style === params.style);
    }
    if (params.language && params.language !== 'all') {
      filtered = filtered.filter((t) => t.language === params.language);
    }
    if (params.type && params.type !== 'all') {
      const wantPro = params.type === 'pro';
      filtered = filtered.filter((t) => t.is_pro === wantPro);
    }
    if (params.limit && params.limit > 0) {
      filtered = filtered.slice(0, params.limit);
    }

    return { templates: filtered, pagination: null, fromApi: false, error: err.message };
  }
}

// 获取单个模板详情
export async function fetchTemplateById(id) {
  try {
    const res = await fetchWithTimeout(`/api/templates/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const result = parseApiResponse(data);

    if (result === null || result === undefined) {
      throw new Error('响应数据格式异常');
    }

    if (Array.isArray(result)) {
      return { template: result[0] || null, fromApi: true };
    }

    return { template: result, fromApi: true };
  } catch (err) {
    console.error('[fetchTemplateById] API 请求失败:', err.message);
    // 降级：从模拟数据中找
    const found = MOCK_TEMPLATES.find((t) => String(t.id) === String(id));
    if (found) {
      return { template: mapTemplateFields(found), fromApi: false, error: err.message };
    }
    // ID 找不到，返回第一条模拟数据作为后备
    const fallback = MOCK_TEMPLATES[0] || null;
    return {
      template: fallback ? mapTemplateFields(fallback) : null,
      fromApi: false,
      error: err.message,
    };
  }
}

// 获取精选模板
export async function fetchFeaturedTemplates(limit = 6) {
  try {
    const res = await fetchWithTimeout(`/api/templates/featured?limit=${limit}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const result = parseApiResponse(data);

    if (result === null || result === undefined) {
      return { templates: [], fromApi: true };
    }

    const templates = Array.isArray(result) ? result : [result];
    return { templates: templates.slice(0, limit), fromApi: true };
  } catch (err) {
    console.error('[fetchFeaturedTemplates] API 请求失败:', err.message);
    // 降级：从前几个模拟数据中取
    const fallback = MOCK_TEMPLATES.slice(0, limit).map(mapTemplateFields);
    return { templates: fallback, fromApi: false, error: err.message };
  }
}

// 直接获取原始模拟数据（用于详情页的后备等）
export function getMockTemplates() {
  return MOCK_TEMPLATES.map(mapTemplateFields);
}

// 获取单个模拟模板
export function getMockTemplateById(id) {
  const found = MOCK_TEMPLATES.find((t) => String(t.id) === String(id));
  return found ? mapTemplateFields(found) : null;
}
