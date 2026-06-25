import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Search, Filter, Heart, Crown, Grid, List, Camera, Briefcase, Users, Link2 } from 'lucide-react'
import { fetchTemplateList, getMockTemplates } from '../utils/api.js'
import { INDUSTRIES, EXPERIENCE_LEVELS } from '../utils/templateStyles.js'
import ResumePreview from '../components/ResumePreview.jsx'

const STYLE_OPTIONS = [
  { value: '简约', label: '简约' },
  { value: '专业', label: '专业' },
  { value: '创意', label: '创意' },
  { value: '技术岗', label: '技术岗' },
  { value: '管理岗', label: '管理岗' },
  { value: '优雅', label: '优雅' },
  { value: '现代', label: '现代' },
  { value: '清爽', label: '清爽' },
]

const LANGUAGE_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: '中文', label: '中文' },
  { value: '英文', label: '英文' },
]

const TYPE_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'free', label: '免费' },
  { value: 'pro', label: 'PRO' },
]

const PHOTO_POSITION_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'hasPhoto', label: '有照片' },
  { value: 'center', label: '居中' },
  { value: 'right', label: '右上方' },
  { value: 'left', label: '左上方' },
]

const INDUSTRY_OPTIONS = [
  { value: 'all', label: '全部行业' },
  { value: 'internet', label: '互联网' },
  { value: 'finance', label: '金融' },
  { value: 'education', label: '教育' },
  { value: 'healthcare', label: '医疗' },
  { value: 'manufacturing', label: '制造' },
  { value: 'government', label: '政府/事业单位' },
  { value: 'design', label: '设计' },
  { value: 'marketing', label: '营销' },
  { value: 'consulting', label: '咨询' },
  { value: 'legal', label: '法律' },
  { value: 'realestate', label: '房地产' },
  { value: 'retail', label: '零售' },
]

const EXPERIENCE_OPTIONS = [
  { value: 'all', label: '全部经验' },
  { value: 'entry', label: '0-3年' },
  { value: 'junior', label: '3-5年' },
  { value: 'mid', label: '5-10年' },
  { value: 'senior', label: '10年以上' },
]

const LIMIT = 200

function TemplateList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fromApi, setFromApi] = useState(true)

  // 内部筛选状态（与 URL 参数同步）
  const [selectedStyles, setSelectedStyles] = useState([])
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedPhotoPosition, setSelectedPhotoPosition] = useState('all')
  const [selectedIndustry, setSelectedIndustry] = useState('all')
  const [selectedExperience, setSelectedExperience] = useState('all')
  const [showPortfolioOnly, setShowPortfolioOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid')

  // 从localStorage获取收藏
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('templateFavorites') || '[]')
    } catch {
      return []
    }
  })

  // 同步收藏到localStorage
  useEffect(() => {
    localStorage.setItem('templateFavorites', JSON.stringify(favorites))
  }, [favorites])

  // ===== 初始化：从 URL 参数同步到内部状态 =====
  useEffect(() => {
    // search 参数
    const urlSearch = searchParams.get('search') || ''
    setSearchQuery(urlSearch)

    // style 参数（支持逗号分隔的多个值）
    const urlStyle = searchParams.get('style')
    if (urlStyle) {
      const styleList = urlStyle
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s && STYLE_OPTIONS.some((opt) => opt.value === s))
      setSelectedStyles(styleList)
    }

    // language 参数
    const urlLanguage = searchParams.get('language') || 'all'
    if (LANGUAGE_OPTIONS.some((opt) => opt.value === urlLanguage)) {
      setSelectedLanguage(urlLanguage)
    }

    // type 参数
    const urlType = searchParams.get('type') || 'all'
    if (TYPE_OPTIONS.some((opt) => opt.value === urlType)) {
      setSelectedType(urlType)
    }

    // photoPosition 参数
    const urlPhotoPosition = searchParams.get('photoPosition') || 'all'
    if (PHOTO_POSITION_OPTIONS.some((opt) => opt.value === urlPhotoPosition)) {
      setSelectedPhotoPosition(urlPhotoPosition)
    }

    // industry 参数
    const urlIndustry = searchParams.get('industry') || 'all'
    if (INDUSTRY_OPTIONS.some((opt) => opt.value === urlIndustry)) {
      setSelectedIndustry(urlIndustry)
    }

    // experience 参数
    const urlExperience = searchParams.get('experience') || 'all'
    if (EXPERIENCE_OPTIONS.some((opt) => opt.value === urlExperience)) {
      setSelectedExperience(urlExperience)
    }

    // portfolio 参数
    const urlPortfolio = searchParams.get('portfolio') === 'true'
    setShowPortfolioOnly(urlPortfolio)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()])

  // ===== 获取模板列表 =====
  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = {
        limit: LIMIT,
      }
      if (searchQuery.trim()) params.search = searchQuery.trim()
      if (selectedStyles.length > 0) params.style = selectedStyles.join(',')
      if (selectedLanguage !== 'all') params.language = selectedLanguage
      if (selectedType !== 'all') params.type = selectedType
      if (selectedPhotoPosition !== 'all') params.photoPosition = selectedPhotoPosition
      if (selectedIndustry !== 'all') params.industry = selectedIndustry
      if (selectedExperience !== 'all') params.experience = selectedExperience

      const { templates: list, fromApi: apiOk } = await fetchTemplateList(params)
      
      // 客户端二次筛选
      let filteredList = list
      
      // 照片位置筛选
      if (selectedPhotoPosition === 'hasPhoto') {
        filteredList = filteredList.filter(t => t.hasPhoto)
      } else if (selectedPhotoPosition === 'center') {
        filteredList = filteredList.filter(t => t.hasPhoto && t.photoPosition === 'center')
      } else if (selectedPhotoPosition === 'right') {
        filteredList = filteredList.filter(t => t.hasPhoto && t.photoPosition === 'right')
      } else if (selectedPhotoPosition === 'left') {
        filteredList = filteredList.filter(t => t.hasPhoto && t.photoPosition === 'left')
      }

      // 行业筛选
      if (selectedIndustry !== 'all') {
        filteredList = filteredList.filter(t => t.industry === selectedIndustry)
      }

      // 经验年限筛选
      if (selectedExperience !== 'all') {
        filteredList = filteredList.filter(t => t.experience === selectedExperience)
      }

      // 作品集筛选（创意行业默认视为有作品集）
      if (showPortfolioOnly) {
        filteredList = filteredList.filter(t => ['design', 'creative', 'marketing'].includes(t.category))
      }

      setTemplates(filteredList)
      setFromApi(apiOk)
    } catch (err) {
      console.error('[TemplateList] 获取模板失败:', err)
      setError(err.message || '获取模板失败')
      let mockTemplates = getMockTemplates()
      
      // 客户端二次筛选
      if (selectedPhotoPosition === 'hasPhoto') {
        mockTemplates = mockTemplates.filter(t => t.hasPhoto)
      } else if (selectedPhotoPosition === 'center') {
        mockTemplates = mockTemplates.filter(t => t.hasPhoto && t.photoPosition === 'center')
      } else if (selectedPhotoPosition === 'right') {
        mockTemplates = mockTemplates.filter(t => t.hasPhoto && t.photoPosition === 'right')
      } else if (selectedPhotoPosition === 'left') {
        mockTemplates = mockTemplates.filter(t => t.hasPhoto && t.photoPosition === 'left')
      }

      if (selectedIndustry !== 'all') {
        mockTemplates = mockTemplates.filter(t => t.industry === selectedIndustry)
      }

      if (selectedExperience !== 'all') {
        mockTemplates = mockTemplates.filter(t => t.experience === selectedExperience)
      }

      if (showPortfolioOnly) {
        mockTemplates = mockTemplates.filter(t => ['design', 'creative', 'marketing'].includes(t.category))
      }
      
      setTemplates(mockTemplates)
      setFromApi(false)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedStyles, selectedLanguage, selectedType, selectedPhotoPosition, selectedIndustry, selectedExperience, showPortfolioOnly])

  // 筛选条件变化 → 触发重新获取 → 同步到URL
  useEffect(() => {
    fetchTemplates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedStyles, selectedLanguage, selectedType, selectedPhotoPosition, selectedIndustry, selectedExperience, showPortfolioOnly])

  // 将筛选条件同步到 URL（使用 replace 以不产生历史记录）
  useEffect(() => {
    const newParams = new URLSearchParams()
    if (searchQuery.trim()) newParams.set('search', searchQuery.trim())
    if (selectedStyles.length > 0) newParams.set('style', selectedStyles.join(','))
    if (selectedLanguage !== 'all') newParams.set('language', selectedLanguage)
    if (selectedType !== 'all') newParams.set('type', selectedType)
    if (selectedPhotoPosition !== 'all') newParams.set('photoPosition', selectedPhotoPosition)
    if (selectedIndustry !== 'all') newParams.set('industry', selectedIndustry)
    if (selectedExperience !== 'all') newParams.set('experience', selectedExperience)
    if (showPortfolioOnly) newParams.set('portfolio', 'true')

    const currentQueryStr = searchParams.toString()
    const newQueryStr = newParams.toString()

    if (currentQueryStr !== newQueryStr) {
      navigate(`/templates${newQueryStr ? '?' + newQueryStr : ''}`, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedStyles, selectedLanguage, selectedType, selectedPhotoPosition, selectedIndustry, selectedExperience, showPortfolioOnly])

  // ===== 交互：切换风格 =====
  const toggleStyle = (style) => {
    setSelectedStyles((prev) => (prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]))
  }

  // ===== 交互：收藏/取消收藏 =====
  const toggleFavorite = (e, templateId) => {
    e.preventDefault()
    e.stopPropagation()
    const newFavorites = favorites.includes(templateId)
      ? favorites.filter((id) => id !== templateId)
      : [...favorites, templateId]
    setFavorites(newFavorites)
  }

  // ===== 清除筛选 =====
  const clearFilters = () => {
    setSelectedStyles([])
    setSelectedLanguage('all')
    setSelectedType('all')
    setSelectedPhotoPosition('all')
    setSelectedIndustry('all')
    setSelectedExperience('all')
    setShowPortfolioOnly(false)
    setSearchQuery('')
  }

  const hasActiveFilters =
    selectedStyles.length > 0 || selectedLanguage !== 'all' || selectedType !== 'all' || selectedPhotoPosition !== 'all' ||
    selectedIndustry !== 'all' || selectedExperience !== 'all' || showPortfolioOnly || searchQuery

  // ===== 组件：骨架屏 =====
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="flex gap-2">
          <div className="h-3 bg-gray-200 rounded w-12" />
          <div className="h-3 bg-gray-200 rounded w-12" />
        </div>
      </div>
    </div>
  )

  // ===== 组件：筛选侧边栏 =====
  const FilterSidebar = ({ mobile = false }) => (
    <div className={`${mobile ? '' : 'hidden md:block'}`}>
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Filter size={18} />
            筛选条件
          </h3>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-sm text-primary-600 hover:text-primary-700">
              清除筛选
            </button>
          )}
        </div>

        {/* 风格筛选 */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">按风格</h4>
          <div className="space-y-2">
            {STYLE_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedStyles.includes(option.value)}
                  onChange={() => toggleStyle(option.value)}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 语言筛选 */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">按语言</h4>
          <div className="space-y-2">
            {LANGUAGE_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="language"
                  checked={selectedLanguage === option.value}
                  onChange={() => setSelectedLanguage(option.value)}
                  className="w-4 h-4 border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 类型筛选 */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">按类型</h4>
          <div className="space-y-2">
            {TYPE_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="type"
                  checked={selectedType === option.value}
                  onChange={() => setSelectedType(option.value)}
                  className="w-4 h-4 border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 照片位置筛选 */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Camera size={14} />
            照片位置
          </h4>
          <div className="space-y-2">
            {PHOTO_POSITION_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="photoPosition"
                  checked={selectedPhotoPosition === option.value}
                  onChange={() => setSelectedPhotoPosition(option.value)}
                  className="w-4 h-4 border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 行业筛选 */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Briefcase size={14} />
            按行业
          </h4>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            {INDUSTRY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 经验年限筛选 */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Users size={14} />
            经验年限
          </h4>
          <select
            value={selectedExperience}
            onChange={(e) => setSelectedExperience(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            {EXPERIENCE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 作品集链接开关 */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Link2 size={14} />
            含作品集
          </h4>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showPortfolioOnly}
              onChange={(e) => setShowPortfolioOnly(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-0"
            />
            <span className="text-sm text-gray-600">仅显示适合设计师/创意行业的模板</span>
          </label>
        </div>

        {mobile && (
          <button
            onClick={() => {
              // 移动端筛选面板打开后不需要额外操作，已自动同步
            }}
            className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 mt-4"
          >
            应用筛选
          </button>
        )}
      </div>
    </div>
  )

  const [showMobileFilter, setShowMobileFilter] = useState(false)

  // ===== 组件：模板卡片 =====
  const TemplateCard = ({ template }) => {
    const hasPhoto = template.hasPhoto
    const isEnglish = template.language === 'english'
    const photoPosition = template.photoPosition

    if (viewMode === 'list') {
      return (
        <Link
          to={`/template/${template.id}`}
          className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all group flex items-center"
        >
          <div className="w-40 h-32 p-2 bg-gray-50 flex items-center justify-center">
            <ResumePreview
              template={template}
              resumeData={{
                name: isEnglish ? 'John Smith' : '张三',
                title: isEnglish ? 'Senior Developer' : '高级工程师',
                email: isEnglish ? 'john@email.com' : 'zhangsan@email.com',
                phone: '138-0000-0000',
                address: isEnglish ? 'New York, USA' : '北京市朝阳区',
                skills: isEnglish ? ['React', 'Node.js'] : ['Java', 'Python'],
                photo: hasPhoto ? 'https://picsum.photos/60/60?random=' + template.id : null,
              }}
              isPreview={true}
            />
          </div>
          <div className="flex-1 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">{template.name}</h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-600">
                    {template.style}
                  </span>
                  {hasPhoto && (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600">
                      {photoPosition === 'center' ? '居中' : photoPosition === 'right' ? '右上' : '左上'}
                    </span>
                  )}
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{template.language}</span>
                </div>
                {template.description && (
                  <p className="text-xs text-gray-500 mt-1.5">{template.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {template.download_count && (
                  <span className="text-xs text-gray-400">{template.download_count} 次使用</span>
                )}
                <button
                  onClick={(e) => toggleFavorite(e, template.id)}
                  className={`p-2 rounded-full transition-all ${
                    favorites.includes(template.id) ? 'bg-red-100 text-red-500' : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart size={18} fill={favorites.includes(template.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          </div>
        </Link>
      )
    }

    return (
      <Link
        to={`/template/${template.id}`}
        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all group"
      >
        <div className="p-3 bg-gray-50">
          <div className="flex items-center justify-center">
            <ResumePreview
              template={template}
              resumeData={{
                name: isEnglish ? 'John Smith' : '张三',
                title: isEnglish ? 'Senior Developer' : '高级工程师',
                email: isEnglish ? 'john@email.com' : 'zhangsan@email.com',
                phone: '138-0000-0000',
                address: isEnglish ? 'New York, USA' : '北京市朝阳区',
                summary: isEnglish
                  ? 'Experienced developer with 8+ years in software development...'
                  : '具有8年软件开发经验，精通Java和Python...',
                skills: isEnglish
                  ? ['React', 'Node.js', 'Python', 'AWS']
                  : ['Java', 'Python', 'Spring', 'Docker'],
                experiences: [{
                  company: isEnglish ? 'TechCorp Inc.' : '某科技公司',
                  position: isEnglish ? 'Senior Engineer' : '高级工程师',
                  startDate: '2020',
                  endDate: 'Present',
                  description: isEnglish
                    ? 'Led team of 5 developers...'
                    : '负责核心模块开发与维护...',
                }],
                educations: [{
                  school: isEnglish ? 'MIT' : '某某大学',
                  major: isEnglish ? 'Computer Science' : '计算机科学',
                  degree: 'Bachelor',
                  startDate: '2012',
                  endDate: '2016',
                }],
                photo: hasPhoto ? 'https://picsum.photos/100/100?random=' + template.id : null,
              }}
              isPreview={true}
            />
          </div>
        </div>

        <div className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 text-sm truncate">
                {template.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary-50 text-primary-600">
                  {template.style}
                </span>
                {hasPhoto && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-600">
                    {photoPosition === 'center' ? '居中' : photoPosition === 'right' ? '右上' : '左上'}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 ml-2">
              {template.is_pro === 1 && (
                <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[10px] font-medium flex items-center gap-0.5">
                  <Crown size={8} />
                  PRO
                </span>
              )}
              <button
                onClick={(e) => toggleFavorite(e, template.id)}
                className={`p-1.5 rounded-full transition-all ${
                  favorites.includes(template.id) ? 'bg-red-100 text-red-500' : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart size={14} fill={favorites.includes(template.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-gray-400">
              {template.download_count ? `${template.download_count} 次使用` : ''}
            </span>
            <span className="text-[10px] text-gray-400">{template.language}</span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部搜索栏 */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-xl font-bold text-primary-600">简历模板</Link>
              <div className="h-6 w-px bg-gray-200" />
              <h1 className="text-lg font-semibold text-gray-900">模板中心</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="搜索模板..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
              </div>
              <button
                onClick={() => setShowMobileFilter(!showMobileFilter)}
                className="flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Filter size={18} />
                <span className="hidden sm:inline">筛选</span>
              </button>
            </div>
          </div>

          {/* 移动端搜索框 */}
          <div className="mt-4 relative sm:hidden">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="搜索模板..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
            />
          </div>
        </div>
      </header>

      {/* 移动端筛选面板 */}
      {showMobileFilter && (
        <div className="bg-white border-t border-gray-200 md:hidden">
          <div className="container mx-auto px-4 py-4">
            <FilterSidebar mobile />
          </div>
        </div>
      )}

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* 侧边栏 */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* 模板列表 */}
          <div className="flex-1 min-w-0">
            {/* 统计信息和视图切换 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-600">
                  共 <span className="font-semibold text-gray-900">{templates.length}</span> 个模板
                </p>
                {!fromApi && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                    显示缓存数据
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            {/* 风格标签快捷筛选 */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={clearFilters}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  selectedStyles.length === 0 ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                全部风格
              </button>
              {STYLE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleStyle(option.value)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    selectedStyles.includes(option.value)
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* 加载状态 */}
            {loading ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-4'}`}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-gray-500">{error}</p>
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">暂无匹配的模板</p>
              </div>
            ) : (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-4'}`}>
                {templates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default TemplateList
