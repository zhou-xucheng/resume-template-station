import { useState, useRef, useEffect } from 'react'
import { 
  User, Briefcase, GraduationCap, Wrench, FolderOpen, MoreHorizontal,
  Plus, Trash2, ChevronDown, ChevronRight
} from 'lucide-react'

// 处理中文输入法的输入组件
const ComposingInput = ({ value, onChange, ...props }) => {
  const [isComposing, setIsComposing] = useState(false)
  
  const handleChange = (e) => {
    if (!isComposing) {
      onChange(e.target.value)
    }
  }
  
  const handleCompositionStart = () => {
    setIsComposing(true)
  }
  
  const handleCompositionEnd = (e) => {
    setIsComposing(false)
    onChange(e.target.value)
  }
  
  return (
    <input
      value={value || ''}
      onChange={handleChange}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      {...props}
    />
  )
}

// 处理中文输入法的文本域组件
const ComposingTextarea = ({ value, onChange, ...props }) => {
  const [isComposing, setIsComposing] = useState(false)
  
  const handleChange = (e) => {
    if (!isComposing) {
      onChange(e.target.value)
    }
  }
  
  const handleCompositionStart = () => {
    setIsComposing(true)
  }
  
  const handleCompositionEnd = (e) => {
    setIsComposing(false)
    onChange(e.target.value)
  }
  
  return (
    <textarea
      value={value || ''}
      onChange={handleChange}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      {...props}
    />
  )
}

const SectionHeader = ({ icon: Icon, title, isOpen, onToggle }) => (
  <div 
    className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 rounded-lg px-3 -mx-3"
    onClick={onToggle}
  >
    <div className="flex items-center gap-2">
      <Icon size={18} className="text-primary-600" />
      <span className="font-semibold text-gray-800">{title}</span>
    </div>
    {isOpen ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
  </div>
)

function ResumeForm({ resumeData, setResumeData }) {
  const [collapsedSections, setCollapsedSections] = useState({})

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // 基础信息模块
  const updateBasicInfo = (field, value) => {
    setResumeData(prev => ({ ...prev, [field]: value }))
  }

  // 工作经历模块
  const addExperience = () => {
    if (resumeData.experience.length >= 5) return
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', position: '', period: '', description: '' }]
    }))
  }

  const updateExperience = (index, field, value) => {
    setResumeData(prev => {
      const experience = [...prev.experience]
      experience[index] = { ...experience[index], [field]: value }
      return { ...prev, experience }
    })
  }

  const removeExperience = (index) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }))
  }

  // 教育背景模块
  const addEducation = () => {
    if (resumeData.education.length >= 3) return
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { school: '', major: '', degree: '', period: '', gpa: '' }]
    }))
  }

  const updateEducation = (index, field, value) => {
    setResumeData(prev => {
      const education = [...prev.education]
      education[index] = { ...education[index], [field]: value }
      return { ...prev, education }
    })
  }

  const removeEducation = (index) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }

  // 技能模块
  const [skillInput, setSkillInput] = useState('')

  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault()
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, { name: skillInput.trim(), level: '了解' }]
      }))
      setSkillInput('')
    }
  }

  const updateSkillLevel = (index, level) => {
    const newSkills = [...resumeData.skills]
    newSkills[index] = { ...newSkills[index], level }
    setResumeData(prev => ({ ...prev, skills: newSkills }))
  }

  const removeSkill = (index) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  // 项目经验模块
  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: '', role: '', description: '', result: '' }]
    }))
  }

  const updateProject = (index, field, value) => {
    setResumeData(prev => {
      const projects = [...prev.projects]
      projects[index] = { ...projects[index], [field]: value }
      return { ...prev, projects }
    })
  }

  const removeProject = (index) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }))
  }

  // 其他信息模块
  const updateOther = (field, value) => {
    setResumeData(prev => ({ ...prev, [field]: value }))
  }

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1"

  return (
    <div className="space-y-4">
      {/* 基础信息模块 */}
      <section>
        <SectionHeader 
          icon={User} 
          title="基础信息" 
          isOpen={collapsedSections.basic !== false}
          onToggle={() => toggleSection('basic')}
        />
        {collapsedSections.basic !== false && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <label className={labelClass}>姓名</label>
              <ComposingInput
                type="text"
                value={resumeData.name}
                onChange={(value) => updateBasicInfo('name', value)}
                className={inputClass}
                placeholder="张三"
              />
            </div>
            <div>
              <label className={labelClass}>职位</label>
              <ComposingInput
                type="text"
                value={resumeData.title}
                onChange={(value) => updateBasicInfo('title', value)}
                className={inputClass}
                placeholder="前端工程师"
              />
            </div>
            <div>
              <label className={labelClass}>邮箱</label>
              <ComposingInput
                type="email"
                value={resumeData.email}
                onChange={(value) => updateBasicInfo('email', value)}
                className={inputClass}
                placeholder="zhangsan@example.com"
              />
            </div>
            <div>
              <label className={labelClass}>手机</label>
              <ComposingInput
                type="tel"
                value={resumeData.phone}
                onChange={(value) => updateBasicInfo('phone', value)}
                className={inputClass}
                placeholder="138-0000-0000"
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>地址</label>
              <ComposingInput
                type="text"
                value={resumeData.address}
                onChange={(value) => updateBasicInfo('address', value)}
                className={inputClass}
                placeholder="北京市朝阳区"
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>个人简介</label>
              <ComposingTextarea
                value={resumeData.summary}
                onChange={(value) => updateBasicInfo('summary', value)}
                className={inputClass}
                rows={3}
                placeholder="简要介绍您的专业背景和核心优势..."
              />
            </div>
          </div>
        )}
      </section>

      {/* 工作经历模块 */}
      <section>
        <SectionHeader 
          icon={Briefcase} 
          title="工作经历" 
          isOpen={collapsedSections.experience !== false}
          onToggle={() => toggleSection('experience')}
        />
        {collapsedSections.experience !== false && (
          <div className="mt-3 space-y-4">
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg relative">
                {resumeData.experience.length > 1 && (
                  <button
                    onClick={() => removeExperience(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>公司名称</label>
                    <ComposingInput
                      type="text"
                      value={exp.company}
                      onChange={(value) => updateExperience(index, 'company', value)}
                      className={inputClass}
                      placeholder="科技有限公司"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>职位</label>
                    <ComposingInput
                      type="text"
                      value={exp.position}
                      onChange={(value) => updateExperience(index, 'position', value)}
                      className={inputClass}
                      placeholder="高级前端工程师"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>时间段</label>
                    <ComposingInput
                      type="text"
                      value={exp.period}
                      onChange={(value) => updateExperience(index, 'period', value)}
                      className={inputClass}
                      placeholder="2020.06 - 2024.06"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>工作描述</label>
                    <ComposingTextarea
                      value={exp.description}
                      onChange={(value) => updateExperience(index, 'description', value)}
                      className={inputClass}
                      rows={3}
                      placeholder="描述您的工作职责和成就..."
                    />
                  </div>
                </div>
              </div>
            ))}
            {resumeData.experience.length < 5 && (
              <button
                onClick={addExperience}
                className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                添加工作经历
              </button>
            )}
          </div>
        )}
      </section>

      {/* 教育背景模块 */}
      <section>
        <SectionHeader 
          icon={GraduationCap} 
          title="教育背景" 
          isOpen={collapsedSections.education !== false}
          onToggle={() => toggleSection('education')}
        />
        {collapsedSections.education !== false && (
          <div className="mt-3 space-y-4">
            {resumeData.education.map((edu, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg relative">
                {resumeData.education.length > 1 && (
                  <button
                    onClick={() => removeEducation(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>学校名称</label>
                    <ComposingInput
                      type="text"
                      value={edu.school}
                      onChange={(value) => updateEducation(index, 'school', value)}
                      className={inputClass}
                      placeholder="北京大学"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>专业</label>
                    <ComposingInput
                      type="text"
                      value={edu.major}
                      onChange={(value) => updateEducation(index, 'major', value)}
                      className={inputClass}
                      placeholder="计算机科学与技术"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>学位</label>
                    <ComposingInput
                      type="text"
                      value={edu.degree}
                      onChange={(value) => updateEducation(index, 'degree', value)}
                      className={inputClass}
                      placeholder="学士/硕士/博士"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>时间段</label>
                    <ComposingInput
                      type="text"
                      value={edu.period}
                      onChange={(value) => updateEducation(index, 'period', value)}
                      className={inputClass}
                      placeholder="2016.09 - 2020.06"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>GPA/荣誉</label>
                    <ComposingInput
                      type="text"
                      value={edu.gpa}
                      onChange={(value) => updateEducation(index, 'gpa', value)}
                      className={inputClass}
                      placeholder="GPA 3.8/4.0，曾获校级一等奖学金"
                    />
                  </div>
                </div>
              </div>
            ))}
            {resumeData.education.length < 3 && (
              <button
                onClick={addEducation}
                className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                添加教育背景
              </button>
            )}
          </div>
        )}
      </section>

      {/* 技能模块 */}
      <section>
        <SectionHeader 
          icon={Wrench} 
          title="技能模块" 
          isOpen={collapsedSections.skills !== false}
          onToggle={() => toggleSection('skills')}
        />
        {collapsedSections.skills !== false && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-2 mb-3">
              {resumeData.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-1 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm">
                  <span>{skill.name}</span>
                  <select
                    value={skill.level}
                    onChange={(e) => updateSkillLevel(index, e.target.value)}
                    className="bg-transparent text-xs border-none outline-none cursor-pointer"
                  >
                    <option value="精通">精通</option>
                    <option value="熟练">熟练</option>
                    <option value="了解">了解</option>
                  </select>
                  <button
                    onClick={() => removeSkill(index)}
                    className="ml-1 text-primary-400 hover:text-primary-700"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={addSkill}
              className={inputClass}
              placeholder="输入技能名称，按回车添加（如：JavaScript）"
            />
            <p className="text-xs text-gray-500 mt-1">输入技能后按 Enter 键添加</p>
          </div>
        )}
      </section>

      {/* 项目经验模块 */}
      <section>
        <SectionHeader 
          icon={FolderOpen} 
          title="项目经验" 
          isOpen={collapsedSections.projects !== false}
          onToggle={() => toggleSection('projects')}
        />
        {collapsedSections.projects !== false && (
          <div className="mt-3 space-y-4">
            {resumeData.projects.map((project, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg relative">
                {resumeData.projects.length > 1 && (
                  <button
                    onClick={() => removeProject(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>项目名称</label>
                    <ComposingInput
                      type="text"
                      value={project.name}
                      onChange={(value) => updateProject(index, 'name', value)}
                      className={inputClass}
                      placeholder="电商平台后台管理系统"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>你的角色</label>
                    <ComposingInput
                      type="text"
                      value={project.role}
                      onChange={(value) => updateProject(index, 'role', value)}
                      className={inputClass}
                      placeholder="前端开发负责人"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>项目描述</label>
                    <ComposingTextarea
                      value={project.description}
                      onChange={(value) => updateProject(index, 'description', value)}
                      className={inputClass}
                      rows={2}
                      placeholder="描述项目背景、技术栈和主要功能..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>项目成果/链接</label>
                    <ComposingInput
                      type="text"
                      value={project.result}
                      onChange={(value) => updateProject(index, 'result', value)}
                      className={inputClass}
                      placeholder="项目访问量突破100万/GitHub链接"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addProject}
              className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              添加项目经验
            </button>
          </div>
        )}
      </section>

      {/* 其他信息模块 */}
      <section>
        <SectionHeader 
          icon={MoreHorizontal} 
          title="其他信息" 
          isOpen={collapsedSections.other !== false}
          onToggle={() => toggleSection('other')}
        />
        {collapsedSections.other !== false && (
          <div className="mt-3 space-y-4">
            <div>
              <label className={labelClass}>证书</label>
              <ComposingInput
                type="text"
                value={resumeData.certificates}
                onChange={(value) => updateOther('certificates', value)}
                className={inputClass}
                placeholder="如：PMP、CET-6"
              />
            </div>
            <div>
              <label className={labelClass}>语言能力</label>
              <ComposingInput
                type="text"
                value={resumeData.languages}
                onChange={(value) => updateOther('languages', value)}
                className={inputClass}
                placeholder="如：英语 CET-6、日语 N2"
              />
            </div>
            <div>
              <label className={labelClass}>兴趣爱好</label>
              <ComposingInput
                type="text"
                value={resumeData.hobbies}
                onChange={(value) => updateOther('hobbies', value)}
                className={inputClass}
                placeholder="如：阅读、摄影、登山"
              />
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default ResumeForm