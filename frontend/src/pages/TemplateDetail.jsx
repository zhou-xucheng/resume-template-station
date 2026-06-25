import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Crown, Download, Heart, Share2, ChevronLeft, RefreshCw, ArrowRight } from 'lucide-react'
import { fetchTemplateById, fetchTemplateList, getMockTemplates } from '../utils/api.js'
import ResumePreview from '../components/ResumePreview.jsx'

function TemplateDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [template, setTemplate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fromApi, setFromApi] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [relatedTemplates, setRelatedTemplates] = useState([])

  useEffect(() => {
    if (!id) return

    const loadTemplate = async () => {
      try {
        setLoading(true)
        setError(null)

        const { template: tpl, fromApi: apiOk } = await fetchTemplateById(id)
        setTemplate(tpl)
        setFromApi(apiOk)

        const favs = JSON.parse(localStorage.getItem('templateFavorites') || '[]')
        setIsFavorite(favs.includes(String(id)) || favs.includes(Number(id)))
      } catch (err) {
        console.error('[TemplateDetail] 加载模板失败:', err)
        setError(err.message || '加载失败')
        const mock = getMockTemplates()
        const found = mock.find((t) => String(t.id) === String(id))
        if (found) setTemplate(found)
        setFromApi(false)
      } finally {
        setLoading(false)
      }
    }

    loadTemplate()
  }, [id])

  useEffect(() => {
    const loadRelated = async () => {
      try {
        let related = []
        if (template && template.style) {
          const { templates } = await fetchTemplateList({ style: template.style, limit: 5 })
          related = templates.filter((t) => String(t.id) !== String(id))
        }
        if (related.length < 3) {
          const { templates: all } = await fetchTemplateList({ limit: 5 })
          const extras = all.filter(
            (t) => String(t.id) !== String(id) && !related.find((r) => String(r.id) === String(t.id)),
          )
          related = [...related, ...extras].slice(0, 4)
        }
        setRelatedTemplates(related.slice(0, 4))
      } catch (err) {
        console.error('[TemplateDetail] 加载相关模板失败:', err)
        const mock = getMockTemplates()
        setRelatedTemplates(mock.filter((t) => String(t.id) !== String(id)).slice(0, 4))
      }
    }

    if (template) loadRelated()
  }, [template, id])

  const toggleFavorite = useCallback(() => {
    const key = 'templateFavorites'
    const raw = localStorage.getItem(key) || '[]'
    let favs
    try {
      favs = JSON.parse(raw)
    } catch {
      favs = []
    }

    const idStr = String(id)
    if (favs.includes(idStr)) {
      favs = favs.filter((f) => String(f) !== idStr)
      setIsFavorite(false)
    } else {
      favs.push(idStr)
      setIsFavorite(true)
    }
    localStorage.setItem(key, JSON.stringify(favs))
  }, [id])

  const handleShare = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(window.location.href).then(
        () => {
          alert('链接已复制！')
        },
        () => {
          prompt('请复制链接：', window.location.href)
        },
      )
    } else {
      prompt('请复制链接：', window.location.href)
    }
  }

  const startEditing = () => {
    if (template) {
      navigate(`/builder/${template.id}`)
    } else {
      navigate('/builder')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-6" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    )
  }

  if (error && !template) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/templates" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700">
          <ChevronLeft size={18} />
          返回模板列表
        </Link>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">未找到模板</p>
        <Link to="/templates" className="text-primary-600 hover:text-primary-700">
          返回模板列表
        </Link>
      </div>
    )
  }

  const hasPhoto = template.hasPhoto
  const isEnglish = template.language === 'english'

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/templates" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6">
        <ChevronLeft size={18} />
        返回模板列表
      </Link>

      {!fromApi && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 flex items-center gap-3">
          <RefreshCw size={18} />
          <span>当前显示示例数据（后端服务不可用）</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center">
              <ResumePreview
                template={template}
                resumeData={{
                  name: isEnglish ? 'John Smith' : '张三',
                  title: isEnglish ? 'Senior Software Engineer' : '高级软件工程师',
                  email: isEnglish ? 'john.smith@email.com' : 'zhangsan@example.com',
                  phone: isEnglish ? '+1 234 567 8900' : '138-0000-0000',
                  address: isEnglish ? 'San Francisco, CA' : '北京市朝阳区',
                  summary: isEnglish
                    ? 'Experienced software engineer with 8+ years of experience in building scalable web applications. Proficient in React, Node.js, and cloud technologies. Strong background in agile methodologies and team leadership.'
                    : '具有8年软件开发经验，精通Java和Python开发，熟悉微服务架构和云原生技术。善于团队协作，具有良好的沟通能力和项目管理经验。曾主导多个大型项目的架构设计和技术选型。',
                  skills: isEnglish
                    ? ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 'PostgreSQL']
                    : ['Java', 'Python', 'Spring Boot', 'Docker', 'Kubernetes', 'MySQL', 'Redis', 'Nginx'],
                  experiences: [
                    {
                      company: isEnglish ? 'TechCorp Inc.' : '某科技公司',
                      position: isEnglish ? 'Senior Engineer' : '高级工程师',
                      startDate: '2020',
                      endDate: 'Present',
                      description: isEnglish
                        ? 'Led team of 5 developers in building microservices architecture. Improved system performance by 40%.'
                        : '负责核心模块开发与维护，主导多个大型项目的架构设计，带领团队完成微服务改造，系统性能提升40%。',
                    },
                    {
                      company: isEnglish ? 'StartupXYZ' : '互联网公司',
                      position: isEnglish ? 'Software Engineer' : '软件工程师',
                      startDate: '2016',
                      endDate: '2020',
                      description: isEnglish
                        ? 'Developed and maintained core e-commerce features using React and Node.js.'
                        : '参与电商平台后端开发，负责核心功能模块的设计与实现。',
                    },
                  ],
                  educations: [
                    {
                      school: isEnglish ? 'Stanford University' : '某某大学',
                      major: isEnglish ? 'Computer Science' : '计算机科学与技术',
                      degree: isEnglish ? 'Master of Science' : '硕士研究生',
                      startDate: '2014',
                      endDate: '2016',
                    },
                    {
                      school: isEnglish ? 'Peking University' : '某某大学',
                      major: isEnglish ? 'Computer Science' : '计算机科学与技术',
                      degree: isEnglish ? 'Bachelor of Science' : '本科',
                      startDate: '2010',
                      endDate: '2014',
                    },
                  ],
                  projects: [
                    {
                      name: isEnglish ? 'E-commerce Platform' : '电商平台重构',
                      description: isEnglish ? 'Led migration to microservices architecture' : '主导微服务架构升级项目',
                    },
                  ],
                  languages: [
                    { name: '英语', level: 'CET-6' },
                    { name: '日语', level: 'N2' },
                  ],
                  certificates: [
                    { name: 'PMP项目管理专业人士' },
                    { name: 'AWS Solutions Architect' },
                  ],
                  photo: hasPhoto ? 'https://picsum.photos/200/200?random=' + template.id : null,
                }}
                isPreview={false}
              />
            </div>
          </div>

          {relatedTemplates.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">相关模板推荐</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedTemplates.map((tpl) => (
                  <Link
                    key={tpl.id}
                    to={`/template/${tpl.id}`}
                    className="bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors group"
                  >
                    <div className="aspect-[3/4] p-2 flex items-center justify-center">
                      <ResumePreview
                        template={tpl}
                        resumeData={{
                          name: tpl.language === 'english' ? 'John' : '张三',
                          title: tpl.language === 'english' ? 'Developer' : '工程师',
                          skills: tpl.language === 'english' ? ['React'] : ['Java'],
                          photo: tpl.hasPhoto ? 'https://picsum.photos/60/60?random=' + tpl.id : null,
                        }}
                        isPreview={true}
                      />
                    </div>
                    <div className="p-2">
                      <h4 className="text-xs font-medium text-gray-900 truncate group-hover:text-primary-600">
                        {tpl.name}
                      </h4>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[10px] px-1.5 py-0.5 bg-primary-50 text-primary-600 rounded">
                          {tpl.style}
                        </span>
                        {tpl.is_pro === 1 && (
                          <span className="text-[10px] text-yellow-600 font-medium">PRO</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{template.name}</h1>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-sm bg-primary-50 text-primary-600">
                {template.style}
              </span>
              {hasPhoto && (
                <span className="px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-600">
                  支持照片
                </span>
              )}
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">{template.language}</span>
              {template.is_pro === 1 && (
                <span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-sm flex items-center gap-1">
                  <Crown size={12} />
                  PRO
                </span>
              )}
            </div>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex items-center justify-between text-gray-600">
                <span>风格</span>
                <span className="font-medium text-gray-900">{template.style}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>语言</span>
                <span className="font-medium text-gray-900">{template.language}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>照片</span>
                <span className="font-medium text-gray-900">{hasPhoto ? '支持' : '不支持'}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>类型</span>
                <span className="font-medium text-gray-900">{template.is_pro === 1 ? 'PRO 模板' : '免费模板'}</span>
              </div>
              {template.download_count && (
                <div className="flex items-center justify-between text-gray-600">
                  <span>使用次数</span>
                  <span className="font-medium text-gray-900">{template.download_count}</span>
                </div>
              )}
            </div>

            {template.description && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
            )}

            <button
              onClick={startEditing}
              className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 mb-3 shadow-lg shadow-primary-500/20"
            >
              <Download size={18} />
              使用此模板
              <ArrowRight size={18} />
            </button>

            <div className="flex gap-3">
              <button
                onClick={toggleFavorite}
                className={`flex-1 py-2.5 border rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                  isFavorite
                    ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                {isFavorite ? '已收藏' : '收藏'}
              </button>

              <button
                onClick={handleShare}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Share2 size={16} />
                分享
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemplateDetail
