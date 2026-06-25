import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Palette, Languages, Crown, CheckCircle, ArrowRight, RefreshCw, Camera } from 'lucide-react'
import { fetchFeaturedTemplates, fetchTemplateList } from '../utils/api.js'
import ResumePreview from '../components/ResumePreview.jsx'

const FEATURED_COUNT = 16

function Home() {
  const [featuredTemplates, setFeaturedTemplates] = useState([])
  const [featuredFromApi, setFeaturedFromApi] = useState(true)
  const [newTemplates, setNewTemplates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true)
        // 加载所有模板（不限制数量）
        const { templates: all } = await fetchTemplateList({ limit: 200 })

        setFeaturedTemplates(all)
        setFeaturedFromApi(true)
      } catch (err) {
        console.error('[Home] 加载首页数据失败:', err)
      } finally {
        setLoading(false)
      }
    }

    loadAll()
  }, [])

  const highlights = [
    { icon: <FileText className="w-8 h-8 text-primary-500" />, title: '海量模板', desc: '100+ 专业简历模板' },
    { icon: <Camera className="w-8 h-8 text-accent-500" />, title: '多种布局', desc: '居中/右侧/左侧/双栏/侧边栏' },
    { icon: <Languages className="w-8 h-8 text-secondary-500" />, title: '双语支持', desc: '中文 / 英文简历' },
    { icon: <Crown className="w-8 h-8 text-yellow-500" />, title: 'PRO 模板', desc: '专业级排版设计' },
  ]

  const steps = [
    { title: '选择模板', desc: '浏览多种布局风格的简历模板' },
    { title: '上传照片', desc: '支持证件照上传到简历' },
    { title: '填写信息', desc: '轻松填写您的个人资料' },
    { title: '下载使用', desc: '导出 PDF 开始求职' },
  ]

  const TemplateCard = ({ template, isFeatured }) => {
    const hasPhoto = template.hasPhoto
    const isEnglish = template.language === 'english'
    const photoPosition = template.photoPosition

    return (
      <Link
        to={`/template/${template.id}`}
        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all group"
      >
        {/* 简历预览区域 */}
        <div className="p-3 bg-gray-50">
          <div className="flex items-center justify-center">
            <ResumePreview
              template={template}
              resumeData={{
                name: isEnglish ? 'John Smith' : '张三',
                title: isEnglish ? 'Senior Developer' : '高级工程师',
                email: isEnglish ? 'john@email.com' : 'zhangsan@email.com',
                phone: isEnglish ? '+1 234 5678' : '138-0000-0000',
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

        {/* 底部信息 */}
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 text-sm truncate">
                {template.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="px-1.5 py-0.5 bg-primary-50 text-primary-600 rounded text-[10px]">
                  {template.style}
                </span>
                {hasPhoto && (
                  <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px]">
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
              {isFeatured && (
                <span className="px-1.5 py-0.5 bg-primary-500 text-white rounded text-[10px] font-medium">
                  热门
                </span>
              )}
            </div>
          </div>
          {template.description && (
            <p className="text-xs text-gray-500 mt-1.5 truncate">{template.description}</p>
          )}
          {template.download_count && (
            <p className="text-[10px] text-gray-400 mt-1">{template.download_count} 次使用</p>
          )}
        </div>
      </Link>
    )
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">专业简历，一键生成</h1>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            支持40种不同布局的简历模板，包含有照片/无照片、居中/右侧/左侧/双栏/侧边栏等多种样式
          </p>
          <Link
            to="/templates"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-colors shadow-lg"
          >
            浏览模板 <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">为什么选择我们？</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {highlights.map((item, idx) => (
              <div key={idx} className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="inline-flex items-center justify-center mb-4">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Templates */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">全部模板</h2>
            <p className="text-gray-500">共 {featuredTemplates.length} 个专业模板，平铺展示，支持滚动浏览</p>
          </div>

          {!featuredFromApi && !loading && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 flex items-center gap-3">
              <RefreshCw size={18} />
              <span>当前显示示例数据（后端服务不可用）</span>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-200" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="flex gap-2">
                      <div className="h-3 bg-gray-200 rounded w-12" />
                      <div className="h-3 bg-gray-200 rounded w-12" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {featuredTemplates.map((template) => (
                <TemplateCard key={`f-${template.id}`} template={template} isFeatured />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How to use */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">如何使用？</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {steps.map((step, idx) => (
              <div key={idx} className="relative text-center">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-xl mb-4 mx-auto">
                  {idx + 1}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Templates */}
      {newTemplates.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">更多模板</h2>
                <p className="text-gray-500">丰富的简历样式选择</p>
              </div>
              <Link to="/templates" className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center gap-1">
                查看全部 <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {newTemplates.slice(0, 16).map((template) => (
                <TemplateCard key={`n-${template.id}`} template={template} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
          <p className="text-gray-400 mb-8">无需注册，免费开始制作您的专业简历</p>
          <Link
            to="/templates"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-500 transition-colors"
          >
            立即开始 <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
