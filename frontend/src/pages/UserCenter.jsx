import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  User, FileText, Heart, Crown, Trash2, Edit, Calendar, Plus
} from 'lucide-react';

function UserCenter() {
  const location = useLocation();
  const initialTab = location.state?.tab || 'resumes';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [favorites, setFavorites] = useState([]);
  const [resumes, setResumes] = useState([]);

  // 加载收藏
  useEffect(() => {
    const favIds = JSON.parse(localStorage.getItem('templateFavorites') || '[]');
    // 尝试从模板API拉取详细信息；拿不到就用占位信息
    const loadFavDetails = async () => {
      const list = [];
      for (const id of favIds) {
        try {
          const res = await fetch(`/api/templates/${id}`);
          if (res.ok) {
            const data = await res.json();
            const tpl = data.template || data.data || {};
            list.push({
              id,
              template_id: id,
              template_name: tpl.name || `模板 ${id}`,
              style: tpl.category || '简约',
              language: tpl.language || '中文',
              is_pro: !!tpl.is_pro,
            });
          } else {
            list.push({
              id, template_id: id, template_name: `模板 ${id}`,
              style: '简约', language: '中文', is_pro: false,
            });
          }
        } catch {
          list.push({
            id, template_id: id, template_name: `模板 ${id}`,
            style: '简约', language: '中文', is_pro: false,
          });
        }
      }
      setFavorites(list);
    };
    loadFavDetails();
  }, []);

  // 加载简历
  useEffect(() => {
    const localResumes = JSON.parse(localStorage.getItem('resumes') || '[]');
    setResumes(localResumes);
  }, []);

  // 删除简历
  const handleDeleteResume = (resumeId) => {
    if (!confirm('确定要删除这份简历吗？删除后无法恢复。')) return;
    const updated = resumes.filter((r) => r.id !== resumeId);
    setResumes(updated);
    localStorage.setItem('resumes', JSON.stringify(updated));
    alert('简历已删除');
  };

  // 删除收藏
  const handleRemoveFavorite = (templateId) => {
    if (!confirm('确定要取消收藏吗？')) return;
    const localFavorites = JSON.parse(localStorage.getItem('templateFavorites') || '[]');
    const newLocalFavorites = localFavorites.filter(id => id !== templateId);
    localStorage.setItem('templateFavorites', JSON.stringify(newLocalFavorites));
    setFavorites(favorites.filter(f => f.template_id !== templateId));
  };

  // 格式化日期
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 信息卡片 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="text-primary-600" size={40} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">我的工作台</h2>
            <p className="text-gray-500">本地浏览器存储，无需登录即可使用</p>
          </div>
          <Link
            to="/templates"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={18} />
            去制作简历
          </Link>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{favorites.length}</div>
            <div className="text-sm text-gray-500">收藏模板</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{resumes.length}</div>
            <div className="text-sm text-gray-500">我的简历</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">无限</div>
            <div className="text-sm text-gray-500">可创建简历</div>
          </div>
        </div>
      </div>

      {/* Tab导航 */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('resumes')}
            className={`flex-1 py-4 text-center font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'resumes'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FileText size={18} />
            我的简历
            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">{resumes.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-4 text-center font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'favorites'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Heart size={18} />
            我的收藏
            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">{favorites.length}</span>
          </button>
        </div>

        <div className="p-6">
          {/* 我的简历 */}
          {activeTab === 'resumes' && (
            <div>
              <div className="mb-6">
                <Link
                  to="/templates"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus size={18} />
                  创建新简历
                </Link>
              </div>

              {resumes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="text-gray-300" size={32} />
                  </div>
                  <p className="text-gray-500 mb-2">还没有保存的简历</p>
                  <p className="text-gray-400 text-sm mb-6">在简历生成器中点击「保存到我的简历」即可保留</p>
                  <Link
                    to="/templates"
                    className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    选择模板开始
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {resumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                          <FileText className="text-primary-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{resume.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {formatDate(resume.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/builder/${resume.template_id || 1}?resumeId=${resume.id}`}
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 transition-colors"
                        >
                          <Edit size={16} />
                          继续编辑
                        </Link>
                        <button
                          onClick={() => handleDeleteResume(resume.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="删除简历"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 我的收藏 */}
          {activeTab === 'favorites' && (
            <div>
              {favorites.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="text-gray-300" size={32} />
                  </div>
                  <p className="text-gray-500 mb-2">还没有收藏的模板</p>
                  <p className="text-gray-400 text-sm mb-6">浏览模板中心，点击❤️收藏喜欢的模板</p>
                  <Link
                    to="/templates"
                    className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    浏览模板
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.map((fav) => (
                    <div key={fav.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
                      <Link to={`/template/${fav.template_id}`}>
                        <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
                          <span className="text-gray-400 font-medium">{fav.template_name}</span>
                          {fav.is_pro && (
                            <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-0.5 rounded text-xs flex items-center gap-1">
                              <Crown size={10} />
                              PRO
                            </span>
                          )}
                        </div>
                      </Link>

                      <div className="p-4">
                        <Link to={`/template/${fav.template_id}`}>
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 mb-2">{fav.template_name}</h3>
                        </Link>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded text-xs">{fav.style}</span>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{fav.language}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/builder/${fav.template_id}`}
                            className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2 text-sm transition-colors"
                          >
                            <Edit size={14} />
                            立即使用
                          </Link>
                          <button
                            onClick={() => handleRemoveFavorite(fav.template_id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserCenter;
