import HomePage from '@/pages/home/HomePage';
import FilePage from '@/pages/file/Mange';
import MangeApplication from '@/pages/mange/Application';
import VideoPage from '@/pages/video/m3u8';
import {
  FolderOpenOutlined,
  AppstoreOutlined,
  ProfileOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';

export const routes = [
  {
    path: '/',
    icon: AppstoreOutlined,
    component: HomePage,
  }, {
    path: '/file',
    icon: FolderOpenOutlined,
    component: FilePage,
  },
  {
    path: '/mange/application',
    icon: ProfileOutlined,
    component: MangeApplication,
  },
  {
    path: '/video/m3u8',
    icon: VideoCameraOutlined,
    component: VideoPage
  }
];
