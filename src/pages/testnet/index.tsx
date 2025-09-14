import Link from 'next/link';
import {
  Card,
  Button,
  Typography,
  Row,
  Col,
  Space,
  message,
  Statistic,
  Tag,
  Divider,
} from 'antd';
import {
  ArrowLeft,
  Globe,
  ExternalLink,
  Server,
  Users,
  Activity,
  Copy,
  Wallet,
  Droplets,
  Star,
  TrendingUp,
  Zap,
  CheckCircle,
  Clock,
  Calendar,
  Settings,
  Shield,
  Code,
  Layers,
  NotebookText,
  Book,
  Notebook,
  Timer,
} from 'lucide-react';
import styles from './index.module.css';
import { SiDiscord, SiX } from 'react-icons/si';
import { useEffect, useRef, useState } from 'react';
import ClientOnly from '../../components/ClientOnly';
import { StatisticsUrl } from '../api/api';
import CountUp from 'react-countup';
import { getDapps } from '../api/dapp';
import router from 'next/router';
const { Title, Paragraph, Text } = Typography;

interface DynamicStatisticProps {
  title: string | React.ReactNode;
  value: number | string;
  color?: string;
  showDecimals?: boolean;
  showSuffix?: boolean;
  suffix?: string;
  duration?: number;
}

function DynamicStatistic({
  title,
  value,
  color = '#f59e0b',
  showDecimals = true,
  showSuffix = true,
  suffix = 's',
  duration = 1.5,
}: DynamicStatisticProps) {
  const numValue =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? parseFloat(value.replace(/[^\d.]/g, '')) || 0
        : 0;

  return (
    <Statistic
      title={title}
      valueRender={() => (
        <CountUp
          end={numValue}
          decimals={showDecimals ? 1 : 0}
          duration={duration}
          suffix={showSuffix ? suffix : ''}
          preserveValue={true}
        />
      )}
      valueStyle={{ color, fontWeight: '600' }}
    />
  );
}

interface Stat {
  block_num: number;
  avg_block_time: string;
  validators: number;
  timestamp: number;
}

export default function TestnetPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [stat, setStat] = useState<Stat | null>(null);
  const [dapps, setDapps] = useState<any[]>([]);
  const [starStyles, setStarStyles] = useState<Array<React.CSSProperties>>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [startedScroll, setStartedScroll] = useState(false);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      messageApi.success(`${label} 已复制到剪贴板`);
    } catch (err) {
      messageApi.error('复制失败');
    }
  };

  useEffect(() => {
    // 生成星星样式（客户端挂载后）
    const styles = [...Array(50)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
    }));
    setStarStyles(styles);
    
    const eventSource = new EventSource(StatisticsUrl);

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setStat(parsed);
      } catch (err) {
        console.error('解析 SSE 数据失败:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE 连接错误:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    const eventSource = new EventSource(StatisticsUrl);
    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setStat(parsed);
      } catch (err) {
        console.error('解析 SSE 数据失败:', err);
      }
    };
    eventSource.onerror = () => {
      eventSource.close();
    };
    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    const fetchDapps = async () => {
      try {
        const params: any = {
          is_feature: 1,
          page: 1,
          page_size: 20, 
        };
        const result = await getDapps(params);
        if (result.success && result.data && Array.isArray(result.data.dapps)) {
          setDapps(result.data.dapps);
        }
      } catch (error) {
        console.error('获取 DApps 失败:', error);
      }
    };
    fetchDapps();
  }, []);

  // 滚动监听
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !startedScroll) {
          setStartedScroll(true);
          autoScroll();
        }
      },
      { threshold: 0.3 }
    );
    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [startedScroll]);

  const autoScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    let step = 1;

    const scroll = () => {
      container.scrollLeft += step;
      if (
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth
      ) {
        container.scrollLeft = 0; // 到底后回到最左侧
      }
      requestAnimationFrame(scroll);
    };
    scroll();
  };

  return (
    <div className={`${styles.container} nav-t-top`}>
      {contextHolder}

      <div className={styles.content}>
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.heroBackground}>
            <div className={styles.heroGlow}></div>
          </div>
          <div className={styles.heroContent}>
            <Title level={1} className={styles.heroTitle}>
              <span className={styles.titleGradient}>
                在 DevPlaza 尽情体验、尝试与构建
              </span>
            </Title>
          </div>
        </div>
      </div>
    </div>
  );
}
