import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, Save, Download, Copy, ChevronDown, Plus, X, Upload,
  Briefcase, GraduationCap, Award, Languages, Heart, FolderOpen, RefreshCw
} from 'lucide-react'
import { getTemplateVariant, ALL_TEMPLATES, LAYOUT_TYPES } from '../utils/templateStyles.js'
import ResumePreview from '../components/ResumePreview.jsx'

// 输入组件 - 定义在组件外部避免重新挂载
const FormInput = ({ label, value, onChange, placeholder, type = 'text', required = false }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && ' *'}</label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
      />
    </div>
  )
}

const FormTextarea = ({ label, value, onChange, placeholder, rows = 3 }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
      />
    </div>
  )
}

const MAX_EXPERIENCES = 5
const MAX_EDUCATIONS = 5
const MAX_SKILLS = 10
const MAX_PROJECTS = 3
const MAX_CERTIFICATES = 5
const MAX_LANGUAGES = 3

function ResumeBuilder() {
  const { templateId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const resumeRef = useRef(null)
  const downloadingRef = useRef(false)

  // 获取当前模板
  const getCurrentTemplate = () => {
    const template = ALL_TEMPLATES.find(t => String(t.id) === String(templateId))
    return template || ALL_TEMPLATES[0]
  }

  const currentTemplate = getCurrentTemplate()

  // 初始化简历数据
  const getInitialResumeData = () => {
    // 尝试从 localStorage 加载
    const saved = localStorage.getItem('resumeDraft')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        console.warn('Failed to parse saved resume draft')
      }
    }
    
    // 默认数据
    return {
      name: '',
      title: '',
      photo: '',
      email: '',
      phone: '',
      address: '',
      summary: '',
      experiences: [],
      educations: [],
      skills: [],
      projects: [],
      certificates: [],
      languages: [],
      interests: '',
    }
  }

  const [resumeData, setResumeData] = useState(getInitialResumeData)
  const [activeTab, setActiveTab] = useState('basic')
  const [showSaved, setShowSaved] = useState(false)
  const [downloading, setDownloading] = useState(false)

  // 自动保存到 localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('resumeDraft', JSON.stringify(resumeData))
    }, 1000)
    return () => clearTimeout(timer)
  }, [resumeData])

  // 从 URL 参数加载简历
  useEffect(() => {
    const resumeId = searchParams.get('resumeId')
    if (resumeId) {
      const savedResume = localStorage.getItem(`resume_${resumeId}`)
      if (savedResume) {
        try {
          setResumeData(JSON.parse(savedResume))
        } catch (err) {
          console.error('Failed to load resume:', err)
        }
      }
    }
  }, [searchParams])

  // 更新字段
  const updateField = (field, value) => {
    setResumeData(prev => ({ ...prev, [field]: value }))
  }

  // 处理照片上传
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过5MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        setResumeData(prev => ({ ...prev, photo: event.target.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  // 移除照片
  const removePhoto = () => {
    setResumeData(prev => ({ ...prev, photo: '' }))
  }

  // 添加工作经历
  const addExperience = () => {
    if (resumeData.experiences.length >= MAX_EXPERIENCES) return
    setResumeData(prev => ({
      ...prev,
      experiences: [...prev.experiences, {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
      }]
    }))
  }

  // 更新工作经历
  const updateExperience = (index, field, value) => {
    setResumeData(prev => {
      const experiences = [...prev.experiences]
      experiences[index] = { ...experiences[index], [field]: value }
      return { ...prev, experiences }
    })
  }

  // 删除工作经历
  const removeExperience = (index) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }))
  }

  // 添加教育背景
  const addEducation = () => {
    if (resumeData.educations.length >= MAX_EDUCATIONS) return
    setResumeData(prev => ({
      ...prev,
      educations: [...prev.educations, {
        school: '',
        major: '',
        degree: '',
        startDate: '',
        endDate: ''
      }]
    }))
  }

  // 更新教育背景
  const updateEducation = (index, field, value) => {
    setResumeData(prev => {
      const educations = [...prev.educations]
      educations[index] = { ...educations[index], [field]: value }
      return { ...prev, educations }
    })
  }

  // 删除教育背景
  const removeEducation = (index) => {
    setResumeData(prev => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== index)
    }))
  }

  // 添加技能
  const addSkill = () => {
    if (resumeData.skills.length >= MAX_SKILLS) return
    setResumeData(prev => ({ ...prev, skills: [...prev.skills, ''] }))
  }

  // 更新技能
  const updateSkill = (index, value) => {
    setResumeData(prev => {
      const skills = [...prev.skills]
      skills[index] = value
      return { ...prev, skills }
    })
  }

  // 删除技能
  const removeSkill = (index) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  // 添加项目经验
  const addProject = () => {
    if (resumeData.projects.length >= MAX_PROJECTS) return
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        name: '',
        description: ''
      }]
    }))
  }

  // 更新项目经验
  const updateProject = (index, field, value) => {
    setResumeData(prev => {
      const projects = [...prev.projects]
      projects[index] = { ...projects[index], [field]: value }
      return { ...prev, projects }
    })
  }

  // 删除项目经验
  const removeProject = (index) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }))
  }

  // 添加证书
  const addCertificate = () => {
    if (resumeData.certificates.length >= MAX_CERTIFICATES) return
    setResumeData(prev => ({
      ...prev,
      certificates: [...prev.certificates, { name: '' }]
    }))
  }

  // 更新证书
  const updateCertificate = (index, value) => {
    setResumeData(prev => {
      const certificates = [...prev.certificates]
      certificates[index] = { name: value }
      return { ...prev, certificates }
    })
  }

  // 删除证书
  const removeCertificate = (index) => {
    setResumeData(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index)
    }))
  }

  // 添加语言能力
  const addLanguage = () => {
    if (resumeData.languages.length >= MAX_LANGUAGES) return
    setResumeData(prev => ({
      ...prev,
      languages: [...prev.languages, { name: '', level: '' }]
    }))
  }

  // 更新语言能力
  const updateLanguage = (index, field, value) => {
    setResumeData(prev => {
      const languages = [...prev.languages]
      languages[index] = { ...languages[index], [field]: value }
      return { ...prev, languages }
    })
  }

  // 删除语言能力
  const removeLanguage = (index) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }))
  }

  // 保存简历
  const saveResume = () => {
    const resumeId = Date.now().toString()
    localStorage.setItem(`resume_${resumeId}`, JSON.stringify(resumeData))
    localStorage.setItem('lastResumeId', resumeId)
    setShowSaved(true)
    setTimeout(() => setShowSaved(false), 3000)
  }

  // 复制链接
  const copyLink = async () => {
    const resumeId = localStorage.getItem('lastResumeId') || Date.now().toString()
    localStorage.setItem(`resume_${resumeId}`, JSON.stringify(resumeData))
    localStorage.setItem('lastResumeId', resumeId)
    
    const url = `${window.location.origin}/builder?resumeId=${resumeId}`
    try {
      await navigator.clipboard.writeText(url)
      alert('链接已复制到剪贴板！')
    } catch {
      prompt('请复制链接：', url)
    }
  }

  // 导出 PDF
  const exportPDF = async () => {
    if (downloadingRef.current) return
    downloadingRef.current = true
    setDownloading(true)

    try {
      const { default: html2canvas } = await import('html2canvas')
      const { jsPDF } = await import('jspdf')

      const element = resumeRef.current
      if (!element) {
        throw new Error('找不到简历元素')
      }

      // 设置导出参数
      const scale = 2
      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 5

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      const fileName = resumeData.name ? `${resumeData.name}_简历.pdf` : '简历.pdf'
      pdf.save(fileName)
    } catch (err) {
      console.error('PDF导出失败:', err)
      alert('导出失败，请重试')
    } finally {
      downloadingRef.current = false
      setDownloading(false)
    }
  }

  // 重置简历
  const resetResume = () => {
    if (confirm('确定要重置所有内容吗？')) {
      localStorage.removeItem('resumeDraft')
      setResumeData(getInitialResumeData())
    }
  }

  // 切换模板
  const switchTemplate = (template) => {
    navigate(`/builder/${template.id}`)
  }

  const tabs = [
    { id: 'basic', label: '基础信息', icon: Briefcase },
    { id: 'experience', label: '工作经历', icon: Briefcase },
    { id: 'education', label: '教育背景', icon: GraduationCap },
    { id: 'skills', label: '专业技能', icon: Award },
    { id: 'projects', label: '项目经验', icon: FolderOpen },
    { id: 'extra', label: '其他信息', icon: Languages },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部工具栏 */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/templates')}
                className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="hidden sm:inline">返回模板</span>
              </button>
              <div className="h-6 w-px bg-gray-200 hidden sm:block" />
              <h1 className="text-lg font-semibold text-gray-900">简历编辑器</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetResume}
                className="flex items-center gap-1.5 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
              >
                <RefreshCw size={16} />
                重置
              </button>
              <button
                onClick={copyLink}
                className="flex items-center gap-1.5 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
              >
                <Copy size={16} />
                分享
              </button>
              <button
                onClick={saveResume}
                className="flex items-center gap-1.5 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
              >
                <Save size={16} />
                保存
              </button>
              <button
                onClick={exportPDF}
                disabled={downloading}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={16} />
                {downloading ? '导出中...' : '导出 PDF'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 保存提示 */}
      {showSaved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 text-center text-sm">
          ✅ 简历已保存！
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* 左侧编辑区域 */}
          <div className="lg:col-span-1">
            {/* 模板选择 */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3">选择模板</h3>
              <select
                value={currentTemplate.id}
                onChange={e => switchTemplate(ALL_TEMPLATES.find(t => String(t.id) === e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                {ALL_TEMPLATES.filter(t => t.language === currentTemplate.language).map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name} ({template.style})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">当前模板：{currentTemplate.name} · {currentTemplate.style}风格</p>
            </div>

            {/* 标签页 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 表单内容 */}
              <div className="p-4">
                {activeTab === 'basic' && (
                  <div className="space-y-4">
                    {/* 照片上传 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">照片</label>
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                          {resumeData.photo ? (
                            <img 
                              src={resumeData.photo} 
                              alt="照片预览" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs text-center">点击上传</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                            id="photo-upload"
                          />
                          <label
                            htmlFor="photo-upload"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer text-sm"
                          >
                            <Upload size={16} />
                            {resumeData.photo ? '更换照片' : '上传照片'}
                          </label>
                          {resumeData.photo && (
                            <button
                              onClick={removePhoto}
                              className="ml-2 px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 text-sm"
                            >
                              移除
                            </button>
                          )}
                          <p className="text-xs text-gray-500 mt-2">支持 JPG、PNG 格式，大小不超过 5MB</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        label="姓名"
                        value={resumeData.name}
                        onChange={v => updateField('name', v)}
                        placeholder="请输入姓名"
                        required
                      />
                      <FormInput
                        label="职位"
                        value={resumeData.title}
                        onChange={v => updateField('title', v)}
                        placeholder="如：前端开发工程师"
                      />
                    </div>

                    <FormInput
                      label="邮箱"
                      value={resumeData.email}
                      onChange={v => updateField('email', v)}
                      placeholder="your@email.com"
                      type="email"
                    />

                    <FormInput
                      label="电话"
                      value={resumeData.phone}
                      onChange={v => updateField('phone', v)}
                      placeholder="请输入手机号码"
                      type="tel"
                    />

                    <FormInput
                      label="地址"
                      value={resumeData.address}
                      onChange={v => updateField('address', v)}
                      placeholder="请输入所在城市"
                    />

                    <FormTextarea
                      label="个人简介"
                      value={resumeData.summary}
                      onChange={v => updateField('summary', v)}
                      placeholder="简要介绍一下您的专业背景和核心优势..."
                      rows={4}
                    />
                  </div>
                )}

                {activeTab === 'experience' && (
                  <div className="space-y-4">
                    {resumeData.experiences.map((exp, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">工作经历 {index + 1}</h4>
                          <button
                            onClick={() => removeExperience(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={18} />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <FormInput
                            label="公司名称"
                            value={exp.company}
                            onChange={v => updateExperience(index, 'company', v)}
                            placeholder="请输入公司名称"
                          />
                          <FormInput
                            label="职位"
                            value={exp.position}
                            onChange={v => updateExperience(index, 'position', v)}
                            placeholder="请输入职位"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <FormInput
                            label="开始时间"
                            value={exp.startDate}
                            onChange={v => updateExperience(index, 'startDate', v)}
                            placeholder="YYYY-MM"
                          />
                          <FormInput
                            label="结束时间"
                            value={exp.endDate}
                            onChange={v => updateExperience(index, 'endDate', v)}
                            placeholder="YYYY-MM 或 至今"
                          />
                        </div>
                        <FormTextarea
                          label="工作描述"
                          value={exp.description}
                          onChange={v => updateExperience(index, 'description', v)}
                          placeholder="请描述您的工作职责和主要成就..."
                          rows={3}
                        />
                      </div>
                    ))}
                    {resumeData.experiences.length < MAX_EXPERIENCES && (
                      <button
                        onClick={addExperience}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={18} />
                        添加工作经历
                      </button>
                    )}
                  </div>
                )}

                {activeTab === 'education' && (
                  <div className="space-y-4">
                    {resumeData.educations.map((edu, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">教育背景 {index + 1}</h4>
                          <button
                            onClick={() => removeEducation(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={18} />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <FormInput
                            label="学校名称"
                            value={edu.school}
                            onChange={v => updateEducation(index, 'school', v)}
                            placeholder="请输入学校名称"
                          />
                          <FormInput
                            label="专业"
                            value={edu.major}
                            onChange={v => updateEducation(index, 'major', v)}
                            placeholder="请输入专业"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <FormInput
                            label="学历"
                            value={edu.degree}
                            onChange={v => updateEducation(index, 'degree', v)}
                            placeholder="本科/硕士等"
                          />
                          <FormInput
                            label="开始时间"
                            value={edu.startDate}
                            onChange={v => updateEducation(index, 'startDate', v)}
                            placeholder="YYYY"
                          />
                          <FormInput
                            label="结束时间"
                            value={edu.endDate}
                            onChange={v => updateEducation(index, 'endDate', v)}
                            placeholder="YYYY"
                          />
                        </div>
                      </div>
                    ))}
                    {resumeData.educations.length < MAX_EDUCATIONS && (
                      <button
                        onClick={addEducation}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={18} />
                        添加教育背景
                      </button>
                    )}
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-1 bg-gray-100 rounded-lg px-3 py-1.5">
                          <input
                            type="text"
                            value={skill}
                            onChange={e => updateSkill(index, e.target.value)}
                            placeholder="输入技能"
                            className="bg-transparent border-none outline-none text-sm w-24"
                          />
                          <button
                            onClick={() => removeSkill(index)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    {resumeData.skills.length < MAX_SKILLS && (
                      <button
                        onClick={addSkill}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={18} />
                        添加技能
                      </button>
                    )}
                  </div>
                )}

                {activeTab === 'projects' && (
                  <div className="space-y-4">
                    {resumeData.projects.map((proj, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">项目经验 {index + 1}</h4>
                          <button
                            onClick={() => removeProject(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={18} />
                          </button>
                        </div>
                        <FormInput
                          label="项目名称"
                          value={proj.name}
                          onChange={v => updateProject(index, 'name', v)}
                          placeholder="请输入项目名称"
                        />
                        <FormTextarea
                          label="项目描述"
                          value={proj.description}
                          onChange={v => updateProject(index, 'description', v)}
                          placeholder="请描述您在项目中的职责和贡献..."
                          rows={3}
                        />
                      </div>
                    ))}
                    {resumeData.projects.length < MAX_PROJECTS && (
                      <button
                        onClick={addProject}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={18} />
                        添加项目经验
                      </button>
                    )}
                  </div>
                )}

                {activeTab === 'extra' && (
                  <div className="space-y-4">
                    {/* 证书 */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">证书荣誉</h4>
                      <div className="space-y-2">
                        {resumeData.certificates.map((cert, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={cert.name}
                              onChange={e => updateCertificate(index, e.target.value)}
                              placeholder="证书名称"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                            />
                            <button
                              onClick={() => removeCertificate(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                      {resumeData.certificates.length < MAX_CERTIFICATES && (
                        <button
                          onClick={addCertificate}
                          className="mt-2 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus size={16} />
                          添加证书
                        </button>
                      )}
                    </div>

                    {/* 语言能力 */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">语言能力</h4>
                      <div className="space-y-2">
                        {resumeData.languages.map((lang, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={lang.name}
                              onChange={e => updateLanguage(index, 'name', e.target.value)}
                              placeholder="语言名称"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                            />
                            <input
                              type="text"
                              value={lang.level}
                              onChange={e => updateLanguage(index, 'level', e.target.value)}
                              placeholder="水平"
                              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                            />
                            <button
                              onClick={() => removeLanguage(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                      {resumeData.languages.length < MAX_LANGUAGES && (
                        <button
                          onClick={addLanguage}
                          className="mt-2 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus size={16} />
                          添加语言
                        </button>
                      )}
                    </div>

                    {/* 兴趣爱好 */}
                    <FormInput
                      label="兴趣爱好"
                      value={resumeData.interests}
                      onChange={v => updateField('interests', v)}
                      placeholder="请输入您的兴趣爱好"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧预览区域 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">简历预览</h3>
                <span className="text-xs text-gray-400">自动保存中...</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                <div ref={resumeRef}>
                  <ResumePreview
                    template={currentTemplate}
                    resumeData={resumeData}
                    isPreview={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder
