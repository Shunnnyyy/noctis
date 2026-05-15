NOCTIS v3 - noctis-lake

运行方式：
1. 双击 index.html 打开首页。
2. 点击 Enter Map 进入多伦多夜间光地图。
3. 地图页面需要联网，因为使用 OpenStreetMap 地图瓦片和 Leaflet。

功能：
- 首页有生成式夜间地图视觉、项目状态和入口。
- 地图页可以按 All / Commercial / Residential / Favorites 过滤。
- 可以搜索标题、时间、状态、观察和分析内容。
- 可以添加摄影点、上传照片、编辑区域、状态、时间、光强、观察和分析。
- 可以收藏点位、删除点位、聚焦当前结果，以及导出 JSON 备份。
- 地图点位会同步到 Supabase，用于跨设备查看和公开投稿。

说明：
- Supabase 项目：noctis-lake。
- 浏览器 localStorage 只作为离线缓存；网络恢复后会继续尝试同步。
- 目前是公开投稿模式，任何访问者都可以新增、编辑或删除公开点位。
