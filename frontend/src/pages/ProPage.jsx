import { Link } from 'react-router-dom';
import { Crown, Check, Star, Zap, Cloud, Download, Shield, FileText } from 'lucide-react';

function ProPage() {
  const proTemplates = [
    { id: 4, name: '技术大牛简历', category: '互联网技术', is_pro: true },
    { id: 5, name: '管理精英简历', category: '咨询管理', is_pro: true },
    { id: 7, name: '专业英文简历', category: '外贸/外企', is_pro: true },
    { id: 8, name: '高端金融简历', category: '金融投行', is_pro: true },
  ];

  const benefits = [
    {
      icon: Star,
      title: '海量精品模板',
      desc: '解锁全部高级模板，涵盖各行各业',
      color: 'bg-primary-100 text-primary-600',
    },
    {
      icon: Download,
      title: '无限次导出PDF',
      desc: '不受次数限制，导出完全无水印',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Cloud,
      title: '云端保存',
      desc: '数据云端备份，换设备也不丢失',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Shield,
      title: '专属高级模块',
      desc: '作品集展示、视频简历等高级功能',
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center py-12 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Crown size={36} />
          <h1 className="text-3xl font-bold">升级 Pro，解锁全部模板</h1>
        </div>
        <p className="text-xl text-yellow-100 max-w-2xl mx-auto">
          一键升级，解锁高级模板和无限导出，让您的求职之路更加顺利
        </p>
        <div className="mt-6 text-sm text-yellow-200">
          💡 目前所有功能均可免费使用，Pro 为可选增值服务
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
        {/* Free Plan */}
        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-green-400 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-green-500 text-white text-sm px-4 py-1 rounded-full flex items-center gap-1">
              <Check size={14} />
              推荐
            </span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-900">免费版</h3>
          <p className="text-gray-500 text-sm mb-4">基础功能，适合尝试</p>
          <div className="mb-6">
            <span className="text-5xl font-bold text-gray-900">¥0</span>
            <span className="text-gray-500 ml-1">/永久免费</span>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-gray-600">
              <Check className="text-green-500" size={18} />
              全部模板浏览
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <Check className="text-green-500" size={18} />
              在线简历编辑
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <Check className="text-green-500" size={18} />
              本地保存简历
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <Check className="text-green-500" size={18} />
              导出 PDF（浏览器打印）
            </li>
            <li className="flex items-center gap-2 text-gray-400">
              <span className="w-4">×</span>
              高级 PRO 模板
            </li>
            <li className="flex items-center gap-2 text-gray-400">
              <span className="w-4">×</span>
              云端多设备同步
            </li>
          </ul>
          <div className="py-3 rounded-lg font-semibold bg-green-50 text-green-700 text-center flex items-center justify-center gap-2">
            <Check size={18} />
            当前正在使用
          </div>
        </div>

        {/* Pro Plan */}
        <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-yellow-400 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-yellow-500 text-white text-sm px-4 py-1 rounded-full flex items-center gap-1">
              <Star size={14} />
              限时优惠
            </span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-900">Pro 会员</h3>
          <p className="text-gray-500 text-sm mb-4">解锁全部高级功能</p>
          <div className="mb-6">
            <span className="text-5xl font-bold text-yellow-600">¥19</span>
            <span className="text-gray-500 ml-1">/月</span>
            <span className="text-sm text-gray-400 ml-2 line-through">原价 ¥29</span>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-gray-600">
              <Check className="text-green-500" size={18} />
              全部免费版功能
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <Check className="text-green-500" size={18} />
              解锁 PRO 专属模板
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <Check className="text-green-500" size={18} />
              无限次导出 PDF（无水印）
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <Check className="text-green-500" size={18} />
              云端保存 + 多设备同步
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <Check className="text-green-500" size={18} />
              专属客服支持
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <Check className="text-green-500" size={18} />
              持续更新的高级模板库
            </li>
          </ul>
          <div className="py-3 rounded-lg font-semibold bg-yellow-100 text-yellow-800 text-center">
            🚧 支付功能即将上线，敬请期待
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Pro 权益说明</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className={`w-16 h-16 ${benefit.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <benefit.icon size={32} />
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">{benefit.title}</h3>
              <p className="text-gray-500 text-sm">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Templates Showcase */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-2">Pro 专属模板</h2>
        <p className="text-center text-gray-500 mb-8">升级 Pro 后即可使用以下高级模板</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {proTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
              <div className="relative h-48 bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
                <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 font-semibold">
                  <Crown size={12} />
                  PRO
                </span>
                <div className="text-center text-yellow-600">
                  <FileText size={48} className="mx-auto mb-2 opacity-50" />
                  <div className="text-sm font-medium">{template.name}</div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1 text-gray-900">{template.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{template.category}</p>
                <div className="w-full py-2 text-center bg-gray-100 text-gray-400 rounded-lg text-sm font-medium">
                  升级 Pro 解锁
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">常见问题</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {[
            { q: '会员可以退款吗？', a: '会员开通后 7 天内如需退款，请联系客服处理。' },
            { q: '如何成为 Pro 会员？', a: '点击上方"升级 Pro"按钮，完成支付即可立即开通（支付功能即将上线）。' },
            { q: '会员到期后简历会怎样？', a: '您之前下载和保存的简历不受影响，可以继续使用免费版。' },
            { q: '支付安全吗？', a: '支付过程安全加密，保障您的资金安全。' },
          ].map((faq, i) => (
            <div key={i} className="bg-white p-5 rounded-xl shadow-sm">
              <h3 className="font-semibold mb-2 text-gray-900">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProPage;
