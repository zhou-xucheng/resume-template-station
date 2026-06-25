// 简历模板布局样式定义

// 布局类型
export const LAYOUT_TYPES = {
  CENTER_AVATAR: 'center_avatar',      // 居中头像
  RIGHT_AVATAR: 'right_avatar',        // 右上角头像
  LEFT_AVATAR: 'left_avatar',          // 左上角头像
  LEFT_SIDEBAR: 'left_sidebar',        // 左侧边栏
  TWO_COLUMN: 'two_column',            // 双栏布局
  SIMPLE_NO_PHOTO: 'simple_no_photo',  // 简洁无照片
  DETAILED: 'detailed',                // 详细型
}

// 行业分类
export const INDUSTRIES = {
  internet: '互联网',
  finance: '金融',
  education: '教育',
  healthcare: '医疗',
  manufacturing: '制造',
  government: '政府/事业单位',
  design: '设计',
  marketing: '营销',
  consulting: '咨询',
  legal: '法律',
  realestate: '房地产',
  retail: '零售',
}

// 经验年限分类
export const EXPERIENCE_LEVELS = {
  entry: '0-3年',
  junior: '3-5年',
  mid: '5-10年',
  senior: '10年以上',
}

// 简历模板样式定义
export const TEMPLATE_STYLES = {
  simple: {
    id: 'simple',
    name: '简约',
    layout: LAYOUT_TYPES.SIMPLE_NO_PHOTO,
    primaryColor: '#333333',
    accentColor: '#666666',
    secondaryColor: '#999999',
    headerBg: 'transparent',
    headerTextColor: '#333333',
    sectionTitleStyle: 'underline',
    sectionTitleBorder: true,
    skillBgColor: '#f5f5f5',
    skillTextColor: '#666666',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    borderRadius: '0',
    boxShadow: 'none',
  },
  professional: {
    id: 'professional',
    name: '专业商务',
    layout: LAYOUT_TYPES.RIGHT_AVATAR,
    primaryColor: '#1a365d',
    accentColor: '#2b6cb0',
    secondaryColor: '#4a5568',
    headerBg: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
    headerTextColor: '#ffffff',
    sectionTitleStyle: 'capsule',
    sectionTitleBorder: true,
    skillBgColor: '#ebf8ff',
    skillTextColor: '#2b6cb0',
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    borderRadius: '0.25rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  creative: {
    id: 'creative',
    name: '创意设计',
    layout: LAYOUT_TYPES.CENTER_AVATAR,
    primaryColor: '#7c3aed',
    accentColor: '#ec4899',
    secondaryColor: '#64748b',
    headerBg: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
    headerTextColor: '#ffffff',
    sectionTitleStyle: 'gradient',
    sectionTitleBorder: false,
    skillBgColor: '#f5f3ff',
    skillTextColor: '#7c3aed',
    fontFamily: '"Inter", system-ui, sans-serif',
    borderRadius: '1rem',
    boxShadow: '0 10px 40px rgba(124, 58, 237, 0.2)',
  },
  tech: {
    id: 'tech',
    name: '技术开发',
    layout: LAYOUT_TYPES.LEFT_SIDEBAR,
    primaryColor: '#059669',
    accentColor: '#10b981',
    secondaryColor: '#374151',
    headerBg: '#1f2937',
    headerTextColor: '#f9fafb',
    sectionTitleStyle: 'underline',
    sectionTitleBorder: true,
    skillBgColor: '#d1fae5',
    skillTextColor: '#059669',
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    borderRadius: '0.25rem',
    boxShadow: '0 4px 20px rgba(5, 150, 105, 0.15)',
  },
  management: {
    id: 'management',
    name: '管理精英',
    layout: LAYOUT_TYPES.TWO_COLUMN,
    primaryColor: '#d97706',
    accentColor: '#f59e0b',
    secondaryColor: '#4b5563',
    headerBg: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
    headerTextColor: '#ffffff',
    sectionTitleStyle: 'capsule',
    sectionTitleBorder: false,
    skillBgColor: '#fffbeb',
    skillTextColor: '#d97706',
    fontFamily: '"Georgia", "Times New Roman", serif',
    borderRadius: '0.5rem',
    boxShadow: '0 8px 25px rgba(217, 119, 6, 0.2)',
  },
  academic: {
    id: 'academic',
    name: '学术研究',
    layout: LAYOUT_TYPES.LEFT_SIDEBAR,
    primaryColor: '#1e40af',
    accentColor: '#3b82f6',
    secondaryColor: '#475569',
    headerBg: '#1e3a5f',
    headerTextColor: '#ffffff',
    sectionTitleStyle: 'underline',
    sectionTitleBorder: true,
    skillBgColor: '#dbeafe',
    skillTextColor: '#1e40af',
    fontFamily: '"Georgia", "Times New Roman", serif',
    borderRadius: '0',
    boxShadow: 'none',
  },
  minimalist: {
    id: 'minimalist',
    name: '极简主义',
    layout: LAYOUT_TYPES.SIMPLE_NO_PHOTO,
    primaryColor: '#1f2937',
    accentColor: '#6b7280',
    secondaryColor: '#9ca3af',
    headerBg: 'transparent',
    headerTextColor: '#1f2937',
    sectionTitleStyle: 'underline',
    sectionTitleBorder: true,
    skillBgColor: '#f3f4f6',
    skillTextColor: '#4b5563',
    fontFamily: '"Inter", system-ui, sans-serif',
    borderRadius: '0',
    boxShadow: 'none',
  },
  fresh: {
    id: 'fresh',
    name: '清新活力',
    layout: LAYOUT_TYPES.CENTER_AVATAR,
    primaryColor: '#06b6d4',
    accentColor: '#22d3ee',
    secondaryColor: '#0891b2',
    headerBg: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    headerTextColor: '#ffffff',
    sectionTitleStyle: 'underline',
    sectionTitleBorder: true,
    skillBgColor: '#ecfeff',
    skillTextColor: '#0891b2',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 20px rgba(6, 182, 212, 0.15)',
  },
}

// 扩展样式 - 更多布局变体
export const TEMPLATE_VARIANTS = {
  // ===== 简约风格 =====
  simple_no_photo: {
    ...TEMPLATE_STYLES.simple,
    id: 'simple_no_photo',
    name: '极简无图',
    layout: LAYOUT_TYPES.SIMPLE_NO_PHOTO,
  },
  simple_center: {
    ...TEMPLATE_STYLES.simple,
    id: 'simple_center',
    name: '简约居中',
    layout: LAYOUT_TYPES.CENTER_AVATAR,
  },
  simple_right: {
    ...TEMPLATE_STYLES.simple,
    id: 'simple_right',
    name: '简约右上',
    layout: LAYOUT_TYPES.RIGHT_AVATAR,
  },
  simple_left: {
    ...TEMPLATE_STYLES.simple,
    id: 'simple_left',
    name: '简约左上',
    layout: LAYOUT_TYPES.LEFT_AVATAR,
  },
  simple_sidebar: {
    ...TEMPLATE_STYLES.simple,
    id: 'simple_sidebar',
    name: '简约侧边',
    layout: LAYOUT_TYPES.LEFT_SIDEBAR,
  },

  // ===== 专业商务风格 =====
  pro_right: {
    ...TEMPLATE_STYLES.professional,
    id: 'pro_right',
    name: '精英职场',
    layout: LAYOUT_TYPES.RIGHT_AVATAR,
  },
  pro_center: {
    ...TEMPLATE_STYLES.professional,
    id: 'pro_center',
    name: '专业居中',
    layout: LAYOUT_TYPES.CENTER_AVATAR,
  },
  pro_left: {
    ...TEMPLATE_STYLES.professional,
    id: 'pro_left',
    name: '专业左上',
    layout: LAYOUT_TYPES.LEFT_AVATAR,
  },
  pro_detailed: {
    ...TEMPLATE_STYLES.professional,
    id: 'pro_detailed',
    name: '详细专业',
    layout: LAYOUT_TYPES.DETAILED,
  },

  // ===== 创意设计风格 =====
  creative_center: {
    ...TEMPLATE_STYLES.creative,
    id: 'creative_center',
    name: '创意居中',
    layout: LAYOUT_TYPES.CENTER_AVATAR,
  },
  creative_right: {
    ...TEMPLATE_STYLES.creative,
    id: 'creative_right',
    name: '创意右上',
    layout: LAYOUT_TYPES.RIGHT_AVATAR,
  },
  creative_left: {
    ...TEMPLATE_STYLES.creative,
    id: 'creative_left',
    name: '创意左上',
    layout: LAYOUT_TYPES.LEFT_AVATAR,
  },

  // ===== 技术开发风格 =====
  tech_sidebar: {
    ...TEMPLATE_STYLES.tech,
    id: 'tech_sidebar',
    name: '技术侧边',
    layout: LAYOUT_TYPES.LEFT_SIDEBAR,
  },
  tech_right: {
    ...TEMPLATE_STYLES.tech,
    id: 'tech_right',
    name: '技术右上',
    layout: LAYOUT_TYPES.RIGHT_AVATAR,
  },
  tech_two_column: {
    ...TEMPLATE_STYLES.tech,
    id: 'tech_two_column',
    name: '技术双栏',
    layout: LAYOUT_TYPES.TWO_COLUMN,
  },

  // ===== 管理精英风格 =====
  mgmt_two_column: {
    ...TEMPLATE_STYLES.management,
    id: 'mgmt_two_column',
    name: '管理双栏',
    layout: LAYOUT_TYPES.TWO_COLUMN,
  },
  mgmt_right: {
    ...TEMPLATE_STYLES.management,
    id: 'mgmt_right',
    name: '高管风范',
    layout: LAYOUT_TYPES.RIGHT_AVATAR,
  },
  mgmt_detailed: {
    ...TEMPLATE_STYLES.management,
    id: 'mgmt_detailed',
    name: '项目管理',
    layout: LAYOUT_TYPES.DETAILED,
  },

  // ===== 学术研究风格 =====
  academic_sidebar: {
    ...TEMPLATE_STYLES.academic,
    id: 'academic_sidebar',
    name: '学术侧边',
    layout: LAYOUT_TYPES.LEFT_SIDEBAR,
  },
  academic_center: {
    ...TEMPLATE_STYLES.academic,
    id: 'academic_center',
    name: '学术居中',
    layout: LAYOUT_TYPES.CENTER_AVATAR,
  },

  // ===== 极简主义风格 =====
  minimalist_clean: {
    ...TEMPLATE_STYLES.minimalist,
    id: 'minimalist_clean',
    name: '极简纯净',
    layout: LAYOUT_TYPES.SIMPLE_NO_PHOTO,
  },
  minimalist_center: {
    ...TEMPLATE_STYLES.minimalist,
    id: 'minimalist_center',
    name: '极简居中',
    layout: LAYOUT_TYPES.CENTER_AVATAR,
  },

  // ===== 清新活力风格 =====
  fresh_center: {
    ...TEMPLATE_STYLES.fresh,
    id: 'fresh_center',
    name: '清新居中',
    layout: LAYOUT_TYPES.CENTER_AVATAR,
  },
  fresh_right: {
    ...TEMPLATE_STYLES.fresh,
    id: 'fresh_right',
    name: '清新右上',
    layout: LAYOUT_TYPES.RIGHT_AVATAR,
  },
}

// ===== 程序化生成100+模板 =====
// 生成器函数：快速创建大量模板
function generateTemplates() {
  const templates = []
  let id = 1

  // 定义各类别的变体组合
  const layouts = [
    { id: 'right', name: '右上角', position: 'right', hasPhoto: true },
    { id: 'center', name: '居中', position: 'center', hasPhoto: true },
    { id: 'left', name: '左上角', position: 'left', hasPhoto: true },
    { id: 'sidebar', name: '侧边栏', position: 'left', hasPhoto: true },
    { id: 'two_column', name: '双栏', position: 'right', hasPhoto: true },
    { id: 'simple', name: '简洁无图', position: null, hasPhoto: false },
  ]

  const styles = [
    { id: 'simple', name: '简约', category: 'simple', color: '#333333' },
    { id: 'pro', name: '专业商务', category: 'professional', color: '#1a365d' },
    { id: 'creative', name: '创意设计', category: 'creative', color: '#7c3aed' },
    { id: 'tech', name: '技术开发', category: 'tech', color: '#059669' },
    { id: 'management', name: '管理精英', category: 'management', color: '#d97706' },
    { id: 'academic', name: '学术研究', category: 'academic', color: '#1e40af' },
    { id: 'minimalist', name: '极简主义', category: 'minimalist', color: '#1f2937' },
    { id: 'fresh', name: '清新活力', category: 'fresh', color: '#06b6d4' },
  ]

  const industries = [
    { id: 'internet', name: '互联网', suitable: ['技术开发', '产品经理', '运营'] },
    { id: 'finance', name: '金融', suitable: ['分析师', '风控', '投顾'] },
    { id: 'education', name: '教育', suitable: ['教师', '培训师', '教研'] },
    { id: 'design', name: '设计', suitable: ['UI设计师', '平面设计师', '创意'] },
    { id: 'marketing', name: '市场营销', suitable: ['市场专员', '品牌经理', '销售'] },
    { id: 'consulting', name: '咨询', suitable: ['顾问', '咨询师', '分析师'] },
    { id: 'manufacturing', name: '制造', suitable: ['工程师', '项目经理', '生产'] },
    { id: 'healthcare', name: '医疗', suitable: ['医生', '护士', '研发'] },
    { id: 'legal', name: '法律', suitable: ['律师', '法务', '合规'] },
    { id: 'realestate', name: '房地产', suitable: ['销售', '策划', '运营'] },
  ]

  const purposes = [
    { id: 'entry', name: '应届生', exp: 'entry' },
    { id: 'junior', name: '3-5年经验', exp: 'junior' },
    { id: 'mid', name: '5-10年经验', exp: 'mid' },
    { id: 'senior', name: '10年以上', exp: 'senior' },
    { id: 'freelancer', name: '自由职业者', exp: 'junior' },
    { id: 'designer', name: '设计师', exp: 'mid' },
    { id: 'developer', name: '开发者', exp: 'mid' },
    { id: 'teacher', name: '教师/研究员', exp: 'senior' },
    { id: 'sales', name: '销售/市场', exp: 'junior' },
    { id: 'operations', name: '运营/产品', exp: 'mid' },
    { id: 'finance_legal', name: '财务/法务', exp: 'senior' },
  ]

  const chineseNames = ['张伟', '李娜', '王强', '刘芳', '陈明', '杨洋', '赵雪', '黄磊', '周杰', '吴敏',
    '徐丽', '孙刚', '马超', '朱琳', '胡涛', '郭芳', '林峰', '何静', '高建', '罗辉',
    '张涛', '李婷', '王磊', '刘洋', '陈静', '杨勇', '赵敏', '黄艳', '周涛', '吴娟']

  const titles = [
    '高级软件工程师', '产品经理', 'UI设计师', '前端开发工程师', '后端开发工程师',
    '数据分析师', '运营专员', '市场经理', '项目经理', '财务主管',
    '人力资源经理', '销售总监', '品牌经理', '内容运营', '新媒体运营',
    '商务拓展经理', '质量管理工程师', '测试工程师', 'DevOps工程师', '架构师',
    '算法工程师', '机器学习工程师', '游戏策划', '编剧', '文案策划',
    '客户经理', '区域销售经理', '渠道经理', '供应链管理', '采购专员']

  // 用途分类名称映射
  const purposeMap = {
    'entry': ['应届生求职', '毕业生', '实习生'],
    'junior': ['职场新人', '社招跳槽', '3-5年经验'],
    'mid': ['中层管理', '资深员工', '5-10年经验'],
    'senior': ['高管简历', '总监级', '资深专家'],
    'freelancer': ['自由职业者', '独立开发者', '创业者'],
    'designer': ['设计师', '创意总监', '艺术指导'],
    'developer': ['程序员', '技术专家', '架构师'],
    'teacher': ['教师', '研究员', '学术专家'],
    'sales': ['销售', '市场专员', '商务拓展'],
    'operations': ['运营', '产品经理', '项目经理'],
    'finance_legal': ['财务', '法务', '合规'],
  }

  // 生成中文模板（60+个）
  let templateId = 1
  
  // 按用途分类生成模板
  for (const purpose of purposes) {
    const suitableOptions = purposeMap[purpose.id] || [purpose.name]
    const count = purpose.id === 'senior' ? 5 : 
                  purpose.id === 'junior' ? 4 : 3

    for (let i = 0; i < count; i++) {
      const style = styles[i % styles.length]
      const layout = layouts[i % layouts.length]
      const industry = industries[Math.floor(i / 3) % industries.length]
      const nameIdx = (templateId - 1) % chineseNames.length
      const titleIdx = (templateId - 1) % titles.length
      const suitable = suitableOptions[i % suitableOptions.length]
      const isPro = templateId % 5 === 0 ? 1 : 0

      templates.push({
        id: templateId,
        variantId: `${style.id}_${layout.id}`,
        name: `${style.name}${layout.name}`,
        category: style.category,
        language: 'chinese',
        is_pro: isPro,
        download_count: Math.floor(Math.random() * 5000) + 500,
        description: `${suitable}适用，${industry.name}行业专属模板`,
        hasPhoto: layout.hasPhoto,
        photoPosition: layout.position,
        industry: industry.id,
        experience: purpose.exp,
        suitableFor: suitable,
        features: [`${style.name}风格`, `${layout.name}布局`, `${industry.name}行业适配`],
        hrReview: `HR视角：${suitable}首选模板，${style.name}${industry.name}风格，专业度高的设计方案`,
      })
      templateId++
    }
  }

  // 生成更多风格变体（补足到80+个）
  for (let i = 0; i < 25; i++) {
    const style = styles[i % styles.length]
    const layout = layouts[(i + 1) % layouts.length]
    const industry = industries[(i + 2) % industries.length]
    const nameIdx = (templateId - 1) % chineseNames.length
    const isPro = i % 4 === 0 ? 1 : 0

    templates.push({
      id: templateId,
      variantId: `${style.id}_${layout.id}`,
      name: `${style.name}${layout.name}V${i + 2}`,
      category: style.category,
      language: 'chinese',
      is_pro: isPro,
      download_count: Math.floor(Math.random() * 3000) + 200,
      description: `${style.name}风格模板，适合${industry.name}行业从业者`,
      hasPhoto: layout.hasPhoto,
      photoPosition: layout.position,
      industry: industry.id,
      experience: ['entry', 'junior', 'mid'][i % 3],
      suitableFor: `${industry.name}从业者`,
      features: [`${style.name}配色`, `${layout.name}布局`, '专业排版'],
      hrReview: `HR视角：${style.name}专业模板，视觉层次清晰，符合${industry.name}行业审美`,
    })
    templateId++
  }

  // 生成英文模板（30+个）
  const englishNames = ['Wei Zhang', 'Na Li', 'Qiang Wang', 'Fang Liu', 'Ming Chen', 'Yang Yang', 'Xue Zhao', 'Lei Huang', 'Jie Zhou', 'Min Wu']
  const englishTitles = ['Senior Software Engineer', 'Product Manager', 'UI/UX Designer', 'Frontend Developer', 'Backend Developer',
    'Data Analyst', 'Operations Specialist', 'Marketing Manager', 'Project Manager', 'Finance Director']

  for (let i = 0; i < 35; i++) {
    const style = styles[i % styles.length]
    const layout = layouts[i % layouts.length]
    const industry = industries[i % industries.length]
    const nameIdx = i % englishNames.length
    const titleIdx = i % englishTitles.length
    const isPro = i % 5 === 0 ? 1 : 0

    templates.push({
      id: templateId,
      variantId: `${style.id}_${layout.id}`,
      name: `${style.name} ${layout.name}`,
      category: style.category,
      language: 'english',
      is_pro: isPro,
      download_count: Math.floor(Math.random() * 2000) + 100,
      description: `${style.name} template for ${industry.name} professionals`,
      hasPhoto: layout.hasPhoto,
      photoPosition: layout.position,
      industry: industry.id,
      experience: ['entry', 'junior', 'mid', 'senior'][i % 4],
      suitableFor: englishTitles[titleIdx],
      features: [`${style.name} Style`, `${layout.name} Layout`, 'Professional'],
      hrReview: `HR Perspective: Professional ${style.name.toLowerCase()} design, perfect for ${industry.name.toLowerCase()} roles`,
    })
    templateId++
  }

  return templates
}

export const ALL_TEMPLATES = generateTemplates()

// 获取模板变体
export function getTemplateVariant(variantId) {
  return TEMPLATE_VARIANTS[variantId] || TEMPLATE_STYLES.simple
}

// 根据模板对象获取样式
export function getStyleByTemplate(template) {
  if (!template) return TEMPLATE_STYLES.simple
  
  if (template.variantId) {
    return getTemplateVariant(template.variantId)
  }
  
  if (template.style) {
    const styleMap = {
      '简约': 'simple',
      '专业商务': 'professional',
      '创意设计': 'creative',
      '技术开发': 'tech',
      '管理精英': 'management',
      '学术研究': 'academic',
      '极简主义': 'minimalist',
      '清新活力': 'fresh',
    }
    const key = styleMap[template.style] || 'simple'
    return TEMPLATE_STYLES[key]
  }
  
  if (template.category && TEMPLATE_STYLES[template.category]) {
    return TEMPLATE_STYLES[template.category]
  }
  
  return TEMPLATE_STYLES.simple
}

// 获取布局类型
export function getLayoutType(template) {
  const style = getStyleByTemplate(template)
  return style.layout || LAYOUT_TYPES.CENTER_AVATAR
}

// 获取照片位置
export function getPhotoPosition(template) {
  if (template.photoPosition) return template.photoPosition
  if (!template.hasPhoto) return null
  
  const style = getStyleByTemplate(template)
  const layout = style.layout
  
  switch (layout) {
    case LAYOUT_TYPES.CENTER_AVATAR:
      return 'center'
    case LAYOUT_TYPES.RIGHT_AVATAR:
      return 'right'
    case LAYOUT_TYPES.LEFT_AVATAR:
    case LAYOUT_TYPES.LEFT_SIDEBAR:
      return 'left'
    default:
      return null
  }
}
