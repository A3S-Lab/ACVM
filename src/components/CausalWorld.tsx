import { useEffect, useMemo, useRef, useState } from 'react';
import industryScenes from '../assets/acvm-industry-scenes.png';
import roleSprites from '../assets/acvm-role-sprites.png';
import { useReducedMotion } from '../hooks';
import { Icon, type IconName } from './Icons';
import { getAcvmStages } from './ProcessReplay';
import {
  storyOptions,
  storyParticipants,
  storyPlaybooks,
  type Story,
  type StoryId,
} from './TrustFlow';

type ActorKey = 'initiator' | 'operator' | 'evidence' | 'acvm' | 'ledger';

type Camera = { x: number; scale: number };

type Route = [number, number, number, number, number, number, number, number];

type Anomaly = {
  action: string;
  signal: string;
  response: string;
};

const worldActors: Record<ActorKey, { x: number; y: number; icon: IconName }> = {
  initiator: { x: 120, y: 315, icon: 'fingerprint' },
  operator: { x: 322, y: 315, icon: 'bolt' },
  evidence: { x: 520, y: 314, icon: 'terminal' },
  acvm: { x: 750, y: 309, icon: 'shield' },
  ledger: { x: 1060, y: 315, icon: 'chain' },
};

const cameraByStage: Record<string, Camera> = {
  agreement: { x: 430, scale: 0.82 },
  operation: { x: 455, scale: 0.9 },
  evidence: { x: 590, scale: 0.94 },
  private: { x: 690, scale: 1.02 },
  control: { x: 810, scale: 1.02 },
  consensus: { x: 930, scale: 0.9 },
  settlement: { x: 625, scale: 0.78 },
};

const routes: Record<string, Route[]> = {
  agreement: [
    [120, 245, 170, 130, 270, 140, 322, 245],
    [120, 245, 330, 55, 590, 62, 750, 230],
  ],
  operation: [[322, 245, 375, 155, 465, 162, 520, 230]],
  evidence: [[520, 230, 584, 125, 680, 125, 750, 224]],
  private: [[520, 230, 620, 50, 825, 62, 750, 224]],
  control: [[750, 224, 785, 125, 846, 130, 875, 228]],
  consensus: [
    [750, 224, 842, 106, 968, 116, 1060, 235],
    [322, 245, 565, 54, 855, 56, 1060, 235],
  ],
  settlement: [[1060, 235, 895, 48, 520, 62, 322, 245]],
};

const storySceneIndex: Record<StoryId, number> = {
  ads: 0,
  sla: 1,
  royalty: 2,
  'gov-subsidy': 3,
  'gov-project': 4,
  supply: 5,
  'factory-quality': 6,
  'factory-energy': 7,
  'finance-credit': 8,
  'finance-insurance': 9,
  'education-training': 10,
  'education-research': 11,
};

const anomalies: Record<StoryId, Anomaly> = {
  ads: {
    action: '把渠道收款账户换成陌生账户',
    signal: '账户在结算前 3 分钟被替换',
    response: 'AnySentry 识别责任主体漂移，ACVM 冻结预算并保全账户变更证据。',
  },
  sla: {
    action: '回写 27 分钟监控数据',
    signal: '服务商指标时间戳出现倒序',
    response: 'AnySentry 阻断账单生成，ACVM 要求以独立探针和原始工单重新归因。',
  },
  royalty: {
    action: '插入一批刷量设备',
    signal: '设备指纹在同一秒形成异常集群',
    response: 'a3s-power 标出无效使用，AnySentry 冻结本期分成并留下差异证明。',
  },
  'gov-subsidy': {
    action: '拿另一批次材料重复申领',
    signal: '项目票据根与已拨付批次重复',
    response: 'ACVM 阻断财政指令，只把重复申领证明提交给审计节点。',
  },
  'gov-project': {
    action: '复用上期施工现场影像',
    signal: '影像位置相同，但 BIM 版本与拍摄时间不一致',
    response: 'AnySentry 拦截进度款，ACVM 生成待复核工程量和影像差异清单。',
  },
  supply: {
    action: '回填运输温控断点',
    signal: '设备离线期间出现批量补录',
    response: 'ACVM 拒绝自动验收，货款保持锁定，异常设备身份进入审计凭证。',
  },
  'factory-quality': {
    action: '替换一个传感器批次号',
    signal: 'QMS 批次与设备证书绑定关系断裂',
    response: 'AnySentry 停止质量放行，ACVM 将问题批次隔离且不影响其他批次。',
  },
  'factory-energy': {
    action: '把节能基线调高 8%',
    signal: '基线版本与合同冻结版本不一致',
    response: 'ACVM 拒绝效果付费，a3s-power 使用已承诺基线重新计算真实节能量。',
  },
  'finance-credit': {
    action: '重复质押同一笔应收账款',
    signal: '票据承诺已被另一融资任务占用',
    response: 'AnySentry 阻断放款，ACVM 只向法定节点披露重复质押证明。',
  },
  'finance-insurance': {
    action: '复用一次旧事故影像',
    signal: '影像指纹命中历史理赔，但定位轨迹不同',
    response: 'ACVM 冻结赔付并请求重新查勘，旧案隐私数据仍不向对方公开。',
  },
  'education-training': {
    action: '导入一批代刷考勤',
    signal: '考勤设备、考试身份与就业记录无法闭合',
    response: 'ACVM 剔除异常学员，不按上报名单结算，并留下成效差异证明。',
  },
  'education-research': {
    action: '补写一段实验记录',
    signal: '记录时间晚于设备日志和成果版本承诺',
    response: 'AnySentry 暂停里程碑拨款，ACVM 保留原状态根等待科研审计复核。',
  },
};

const categoryColor: Record<Story['category'], [number, number, number]> = {
  商业: [91, 161, 255],
  政务: [74, 196, 201],
  制造: [255, 142, 74],
  金融: [180, 132, 255],
  教育: [89, 207, 144],
};

function rgba(color: [number, number, number], alpha: number) {
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

function curvePoint(route: Route, progress: number) {
  const [x0, y0, x1, y1, x2, y2, x3, y3] = route;
  const p = 1 - progress;
  return {
    x: p ** 3 * x0 + 3 * p ** 2 * progress * x1 + 3 * p * progress ** 2 * x2 + progress ** 3 * x3,
    y: p ** 3 * y0 + 3 * p ** 2 * progress * y1 + 3 * p * progress ** 2 * y2 + progress ** 3 * y3,
  };
}

function drawRoute(
  context: CanvasRenderingContext2D,
  route: Route,
  color: string,
  alpha: number,
  time: number,
  moving: boolean,
) {
  context.save();
  context.globalAlpha = alpha;
  context.strokeStyle = color;
  context.lineWidth = moving ? 2.4 : 1.1;
  context.setLineDash(moving ? [9, 11] : [4, 14]);
  context.lineDashOffset = moving ? -(time / 38) % 20 : 0;
  context.shadowColor = color;
  context.shadowBlur = moving ? 13 : 4;
  context.beginPath();
  context.moveTo(route[0], route[1]);
  context.bezierCurveTo(route[2], route[3], route[4], route[5], route[6], route[7]);
  context.stroke();
  context.setLineDash([]);

  if (moving) {
    for (let index = 0; index < 3; index += 1) {
      const progress = ((time / 2600) + index / 3) % 1;
      const point = curvePoint(route, progress);
      context.globalAlpha = 0.45 + index * 0.2;
      context.fillStyle = color;
      context.shadowBlur = 18;
      context.beginPath();
      context.arc(point.x, point.y, 3.7, 0, Math.PI * 2);
      context.fill();
    }
  }
  context.restore();
}

function drawPlatform(context: CanvasRenderingContext2D, x: number, y: number, color: string, active: boolean, time: number) {
  context.save();
  context.translate(x, y);
  const pulse = active ? 1 + Math.sin(time / 420) * 0.08 : 1;
  context.scale(pulse, pulse * 0.45);
  const gradient = context.createRadialGradient(0, 0, 4, 0, 0, active ? 64 : 48);
  gradient.addColorStop(0, active ? color : 'rgba(120, 145, 175, .12)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(0, 0, active ? 64 : 48, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawRoleSprite(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  sprite: number,
  x: number,
  bottom: number,
  width: number,
  height: number,
  filter: string,
  alpha: number,
) {
  if (!image.complete || !image.naturalWidth) return;
  const sourceWidth = image.naturalWidth / 4;
  context.save();
  context.globalAlpha = alpha;
  context.filter = filter;
  context.drawImage(image, sourceWidth * sprite, 0, sourceWidth, image.naturalHeight, x - width / 2, bottom - height, width, height);
  context.restore();
}

function drawIndustryScene(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  storyId: StoryId,
  x: number,
  bottom: number,
  width: number,
  height: number,
  filter: string,
  alpha: number,
) {
  if (!image.complete || !image.naturalWidth) return;
  const sceneIndex = storySceneIndex[storyId];
  const column = sceneIndex % 4;
  const row = Math.floor(sceneIndex / 4);
  const sourceWidth = image.naturalWidth / 4;
  const sourceHeight = image.naturalHeight / 3;
  context.save();
  context.globalAlpha = alpha;
  context.filter = filter;
  context.drawImage(
    image,
    sourceWidth * column,
    sourceHeight * row,
    sourceWidth,
    sourceHeight,
    x - width / 2,
    bottom - height,
    width,
    height,
  );
  context.restore();
}

function drawFloor(context: CanvasRenderingContext2D, color: [number, number, number], trusted: boolean) {
  const floor = context.createLinearGradient(0, 255, 0, 430);
  floor.addColorStop(0, trusted ? rgba(color, 0.08) : 'rgba(139, 105, 57, .04)');
  floor.addColorStop(1, 'rgba(3, 6, 10, 0)');
  context.fillStyle = floor;
  context.beginPath();
  context.moveTo(-120, 260);
  context.lineTo(1400, 260);
  context.lineTo(1510, 430);
  context.lineTo(-230, 430);
  context.closePath();
  context.fill();

  context.save();
  context.strokeStyle = trusted ? rgba(color, 0.1) : 'rgba(165, 125, 70, .06)';
  context.lineWidth = 1;
  for (let x = -100; x <= 1400; x += 70) {
    context.beginPath();
    context.moveTo(x, 260);
    context.lineTo(650 + (x - 650) * 1.34, 430);
    context.stroke();
  }
  for (let y = 275; y <= 430; y += 28) {
    context.beginPath();
    context.moveTo(-180, y);
    context.lineTo(1450, y);
    context.stroke();
  }
  context.restore();
}

function drawIndustryHorizon(
  context: CanvasRenderingContext2D,
  category: Story['category'],
  color: [number, number, number],
  trusted: boolean,
) {
  context.save();
  context.globalAlpha = trusted ? 0.42 : 0.18;
  context.strokeStyle = trusted ? rgba(color, 0.44) : 'rgba(187, 142, 78, .24)';
  context.fillStyle = trusted ? rgba(color, 0.055) : 'rgba(120, 91, 51, .035)';
  context.lineWidth = 1.2;

  if (category === '制造') {
    for (let x = 20; x < 1260; x += 125) {
      roundedRect(context, x, 182 + (x % 3) * 10, 78, 65, 7);
      context.fill();
      context.stroke();
      context.beginPath();
      context.arc(x + 39, 215, 17, 0, Math.PI * 2);
      context.stroke();
    }
  } else if (category === '政务') {
    for (let x = 5; x < 1280; x += 175) {
      context.beginPath();
      context.moveTo(x, 250);
      context.lineTo(x + 68, 160);
      context.lineTo(x + 136, 250);
      context.closePath();
      context.fill();
      context.stroke();
      for (let column = 0; column < 4; column += 1) {
        context.strokeRect(x + 30 + column * 22, 195, 8, 55);
      }
    }
  } else if (category === '金融') {
    for (let x = 45; x < 1260; x += 150) {
      const height = 44 + ((x / 10) % 5) * 13;
      context.fillRect(x, 250 - height, 54, height);
      context.strokeRect(x, 250 - height, 54, height);
      context.beginPath();
      context.moveTo(x + 8, 240 - height / 2);
      context.lineTo(x + 26, 226 - height / 2);
      context.lineTo(x + 43, 231 - height / 2);
      context.stroke();
    }
  } else if (category === '教育') {
    for (let x = 25; x < 1260; x += 165) {
      context.beginPath();
      context.moveTo(x, 250);
      context.lineTo(x + 64, 181);
      context.lineTo(x + 128, 250);
      context.closePath();
      context.fill();
      context.stroke();
      context.beginPath();
      context.arc(x + 64, 183, 22, Math.PI, 0);
      context.stroke();
    }
  } else {
    for (let x = 15; x < 1280; x += 145) {
      roundedRect(context, x, 175 + (x % 4) * 8, 106, 68, 10);
      context.fill();
      context.stroke();
      context.beginPath();
      context.moveTo(x + 13, 229);
      context.lineTo(x + 34, 210);
      context.lineTo(x + 57, 220);
      context.lineTo(x + 89, 191);
      context.stroke();
    }
  }
  context.restore();
}

function drawPrivacyDome(context: CanvasRenderingContext2D, color: [number, number, number], active: boolean, time: number) {
  context.save();
  context.translate(750, 224);
  context.globalAlpha = active ? 0.92 : 0.18;
  const gradient = context.createRadialGradient(-15, -45, 10, 0, 0, 118);
  gradient.addColorStop(0, 'rgba(205, 192, 255, .15)');
  gradient.addColorStop(0.65, 'rgba(129, 99, 255, .045)');
  gradient.addColorStop(1, 'rgba(129, 99, 255, 0)');
  context.fillStyle = gradient;
  context.strokeStyle = 'rgba(178, 154, 255, .58)';
  context.lineWidth = active ? 1.8 : 1;
  context.beginPath();
  context.ellipse(0, 0, 113, 126, 0, Math.PI, 0);
  context.lineTo(113, 0);
  context.ellipse(0, 0, 113, 31, 0, 0, Math.PI * 2);
  context.fill();
  context.stroke();
  context.setLineDash([5, 9]);
  context.lineDashOffset = -(time / 55) % 14;
  context.strokeStyle = rgba(color, 0.5);
  context.beginPath();
  context.ellipse(0, -4, 84, 104, 0, Math.PI, 0);
  context.stroke();
  context.setLineDash([]);
  context.textAlign = 'center';
  context.fillStyle = active ? 'rgba(218, 208, 255, .92)' : 'rgba(189, 177, 232, .4)';
  context.font = '600 11px system-ui, sans-serif';
  context.fillText('a3s-box', -39, -102);
  context.fillText('a3s-power', 42, -102);
  context.restore();
}

function drawSentry(context: CanvasRenderingContext2D, active: boolean, failure: boolean, time: number) {
  const color = failure ? '#ff667c' : '#67e2b5';
  context.save();
  context.translate(875, 235);
  context.globalAlpha = active || failure ? 0.96 : 0.25;
  const sweep = -0.65 + ((Math.sin(time / 730) + 1) / 2) * 1.3;
  context.fillStyle = failure ? 'rgba(255, 74, 101, .12)' : 'rgba(83, 229, 176, .09)';
  context.beginPath();
  context.moveTo(0, -86);
  context.arc(0, -86, 132, sweep - 0.19, sweep + 0.19);
  context.closePath();
  context.fill();
  context.strokeStyle = color;
  context.shadowColor = color;
  context.shadowBlur = 15;
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(0, -93);
  context.lineTo(0, 33);
  context.stroke();
  roundedRect(context, -34, -115, 68, 42, 12);
  context.fillStyle = failure ? 'rgba(65, 8, 18, .92)' : 'rgba(7, 38, 29, .92)';
  context.fill();
  context.stroke();
  context.shadowBlur = 0;
  context.fillStyle = color;
  context.textAlign = 'center';
  context.font = '600 10px system-ui, sans-serif';
  context.fillText('AnySentry', 0, -91);
  context.restore();
}

function drawLedgerField(context: CanvasRenderingContext2D, color: [number, number, number], active: boolean, time: number) {
  context.save();
  context.translate(1060, 231);
  context.globalAlpha = active ? 0.95 : 0.28;
  context.strokeStyle = rgba(color, active ? 0.7 : 0.32);
  context.lineWidth = active ? 2 : 1;
  context.setLineDash([7, 10]);
  context.lineDashOffset = -(time / 70) % 17;
  context.beginPath();
  context.arc(0, 0, 100, 0, Math.PI * 2);
  context.stroke();
  context.beginPath();
  context.arc(0, 0, 72, 0, Math.PI * 2);
  context.stroke();
  context.setLineDash([]);
  for (let index = 0; index < 4; index += 1) {
    const angle = (Math.PI * 2 * index) / 4 + time / 5200;
    const x = Math.cos(angle) * 84;
    const y = Math.sin(angle) * 58;
    context.fillStyle = index < 3 && active ? '#67e2b5' : rgba(color, 0.62);
    context.shadowColor = context.fillStyle;
    context.shadowBlur = 12;
    context.beginPath();
    context.arc(x, y, active ? 5 : 3.5, 0, Math.PI * 2);
    context.fill();
  }
  context.shadowBlur = 0;
  context.fillStyle = rgba(color, active ? 0.9 : 0.45);
  context.textAlign = 'center';
  context.font = '600 11px system-ui, sans-serif';
  context.fillText('联盟共识', 0, -111);
  context.restore();
}

function drawBlackBox(context: CanvasRenderingContext2D, time: number) {
  context.save();
  context.translate(825, 203 + Math.sin(time / 700) * 3);
  context.shadowColor = 'rgba(238, 181, 94, .18)';
  context.shadowBlur = 25;
  roundedRect(context, -77, -54, 154, 108, 16);
  const gradient = context.createLinearGradient(-77, -54, 77, 54);
  gradient.addColorStop(0, 'rgba(111, 74, 25, .84)');
  gradient.addColorStop(0.55, 'rgba(20, 16, 13, .96)');
  gradient.addColorStop(1, 'rgba(6, 8, 11, .98)');
  context.fillStyle = gradient;
  context.fill();
  context.strokeStyle = 'rgba(238, 181, 94, .45)';
  context.stroke();
  context.shadowBlur = 0;
  context.textAlign = 'center';
  context.fillStyle = '#e4b96f';
  context.font = '600 16px ui-monospace, SFMono-Regular, Menlo, monospace';
  context.fillText('result = true', 0, -2);
  context.fillStyle = 'rgba(213, 179, 118, .48)';
  context.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace';
  context.fillText('source: unknown', 0, 21);
  context.restore();
}

function drawWorldLayer({
  context,
  story,
  stageKey,
  stageIndex,
  actorKeys,
  failure,
  trusted,
  time,
  camera,
  roleImage,
  industryImage,
}: {
  context: CanvasRenderingContext2D;
  story: Story;
  stageKey: string;
  stageIndex: number;
  actorKeys: ActorKey[];
  failure: boolean;
  trusted: boolean;
  time: number;
  camera: Camera;
  roleImage: HTMLImageElement;
  industryImage: HTMLImageElement;
}) {
  const color = categoryColor[story.category];
  const accent = trusted ? `rgb(${color.join(',')})` : '#dda95e';

  const backdrop = context.createLinearGradient(0, 0, 0, 430);
  const trustedTop = `rgb(${Math.round(7 + color[0] * 0.1)}, ${Math.round(10 + color[1] * 0.1)}, ${Math.round(16 + color[2] * 0.1)})`;
  backdrop.addColorStop(0, trusted ? trustedTop : 'rgb(22, 18, 13)');
  backdrop.addColorStop(0.52, trusted ? 'rgb(8, 13, 22)' : 'rgb(13, 12, 11)');
  backdrop.addColorStop(1, '#05070b');
  context.fillStyle = backdrop;
  context.fillRect(0, 0, 1000, 430);

  const light = context.createRadialGradient(500, 245, 0, 500, 245, 390);
  light.addColorStop(0, trusted ? rgba(color, 0.12) : 'rgba(197, 141, 68, .055)');
  light.addColorStop(1, 'rgba(0, 0, 0, 0)');
  context.fillStyle = light;
  context.fillRect(0, 0, 1000, 430);

  context.save();
  context.translate(500, 215);
  context.scale(camera.scale, camera.scale);
  context.translate(-camera.x, -215);

  drawIndustryHorizon(context, story.category, color, trusted);
  drawFloor(context, color, trusted);

  if (trusted) {
    Object.entries(routes).forEach(([key, routeSet], index) => {
      if (index >= stageIndex || key === stageKey) return;
      routeSet.forEach((route) => drawRoute(context, route, rgba(color, 0.65), 0.22, time, false));
    });
    const activeRoutes = failure
      ? [[520, 230, 640, 82, 810, 88, 875, 228] as Route]
      : (routes[stageKey] ?? routes.evidence);
    activeRoutes.forEach((route) => drawRoute(context, route, failure ? '#ff667c' : accent, 0.92, time, true));
  } else {
    const legacyRoutes: Route[] = [
      [520, 235, 606, 130, 686, 134, 750, 205],
      [750, 205, 840, 126, 990, 135, 1060, 235],
      [1060, 235, 890, 72, 510, 75, 322, 245],
    ];
    legacyRoutes.forEach((route) => drawRoute(context, route, '#e0a95a', 0.42, time, true));
  }

  Object.entries(worldActors).forEach(([key, actor]) => {
    drawPlatform(context, actor.x, actor.y + 2, trusted ? accent : '#c28c45', actorKeys.includes(key as ActorKey), time);
  });

  const mutedFilter = trusted ? 'saturate(.96) brightness(.96)' : 'grayscale(.88) sepia(.2) brightness(.47)';
  const inactiveAlpha = trusted ? 0.92 : 0.46;
  drawRoleSprite(context, roleImage, 0, 120, 316, 102, 146, mutedFilter, inactiveAlpha);
  drawRoleSprite(context, roleImage, 1, 322, 313, 172, 132, mutedFilter, inactiveAlpha);
  drawIndustryScene(context, industryImage, story.id, 520, 312, 224, 188, mutedFilter, trusted ? 0.96 : 0.28);

  if (trusted) {
    for (let index = 0; index < 3; index += 1) {
      const x = 618 + index * 37;
      context.save();
      context.globalAlpha = stageIndex >= 2 ? 0.92 : 0.28;
      context.strokeStyle = rgba(color, 0.58);
      context.fillStyle = 'rgba(8, 15, 25, .9)';
      roundedRect(context, x, 188 - index * 5, 24, 74 + index * 5, 8);
      context.fill();
      context.stroke();
      context.fillStyle = stageIndex >= 2 ? '#67e2b5' : rgba(color, 0.45);
      context.beginPath();
      context.arc(x + 12, 203 - index * 5, 3, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }
    context.save();
    context.globalAlpha = stageIndex >= 2 ? 0.85 : 0.3;
    context.fillStyle = rgba(color, 0.82);
    context.textAlign = 'center';
    context.font = '600 10px system-ui, sans-serif';
    context.fillText('Progressive API · Zero Trust', 666, 174);
    context.restore();
    drawPrivacyDome(context, color, stageKey === 'private', time);
    drawRoleSprite(context, roleImage, 2, 750, 310, 135, 132, 'saturate(1.05) brightness(1.04)', 1);
    drawSentry(context, stageKey === 'control', failure, time);
    drawLedgerField(context, color, ['consensus', 'settlement'].includes(stageKey), time);
    drawRoleSprite(context, roleImage, 3, 1060, 315, 180, 142, 'saturate(.9) brightness(.88)', 0.92);

    if (stageKey === 'settlement' && !failure) {
      context.save();
      context.translate(430, 112 + Math.sin(time / 500) * 4);
      context.fillStyle = '#67e2b5';
      context.shadowColor = '#67e2b5';
      context.shadowBlur = 22;
      roundedRect(context, -70, -21, 140, 42, 12);
      context.fill();
      context.fillStyle = '#062319';
      context.textAlign = 'center';
      context.font = '700 14px system-ui, sans-serif';
      context.fillText(story.amount, 0, 5);
      context.restore();
    }
  } else {
    drawRoleSprite(context, roleImage, 3, 1060, 315, 180, 142, mutedFilter, 0.38);
  }

  if (failure && trusted) {
    context.save();
    context.translate(520, 128);
    context.strokeStyle = '#ff667c';
    context.fillStyle = 'rgba(255, 71, 99, .13)';
    context.shadowColor = '#ff667c';
    context.shadowBlur = 18;
    for (let index = 0; index < 3; index += 1) {
      const size = 22 + index * 15 + Math.sin(time / 280 + index) * 4;
      context.beginPath();
      context.arc(0, 0, size, 0, Math.PI * 2);
      context.stroke();
    }
    context.beginPath();
    context.arc(0, 0, 16, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  context.restore();
  if (!trusted) drawBlackBox(context, time);
}

function BusinessWorldCanvas({
  story,
  stageKey,
  stageIndex,
  actorKeys,
  failure,
  reveal,
  active,
}: {
  story: Story;
  stageKey: string;
  stageIndex: number;
  actorKeys: ActorKey[];
  failure: boolean;
  reveal: number;
  active: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const live = useRef({ stageKey, stageIndex, actorKeys, failure, reveal, active });

  useEffect(() => {
    live.current = { stageKey, stageIndex, actorKeys, failure, reveal, active };
  }, [active, actorKeys, failure, reveal, stageIndex, stageKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const roleImage = new Image();
    const industryImage = new Image();
    roleImage.src = roleSprites;
    industryImage.src = industryScenes;

    const initialCamera = cameraByStage[live.current.stageKey] ?? cameraByStage.evidence;
    const camera = { ...initialCamera };
    let frame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const render = (time: number) => {
      const current = live.current;
      const target = cameraByStage[current.stageKey] ?? cameraByStage.evidence;
      const easing = reducedMotion ? 1 : 0.055;
      camera.x += (target.x - camera.x) * easing;
      camera.scale += (target.scale - camera.scale) * easing;

      context.setTransform(dpr * width / 1000, 0, 0, dpr * height / 430, 0, 0);
      context.clearRect(0, 0, 1000, 430);
      drawWorldLayer({
        context,
        story,
        stageKey: current.stageKey,
        stageIndex: current.stageIndex,
        actorKeys: current.actorKeys,
        failure: current.failure,
        trusted: false,
        time: reducedMotion ? 0 : time,
        camera,
        roleImage,
        industryImage,
      });

      context.save();
      context.beginPath();
      context.rect(0, 0, current.reveal * 10, 430);
      context.clip();
      drawWorldLayer({
        context,
        story,
        stageKey: current.stageKey,
        stageIndex: current.stageIndex,
        actorKeys: current.actorKeys,
        failure: current.failure,
        trusted: true,
        time: reducedMotion ? 0 : time,
        camera,
        roleImage,
        industryImage,
      });
      context.restore();

      if (!reducedMotion || current.active) frame = window.requestAnimationFrame(render);
    };

    frame = window.requestAnimationFrame(render);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [active, reducedMotion, story]);

  return <canvas ref={canvasRef} className="causal-world-canvas" role="img" aria-label={`${story.title}业务孪生世界：左侧显示 ACVM 可验证信任层，右侧显示传统合约盲区`} />;
}

function projectedActorPosition(key: ActorKey, camera: Camera) {
  return ((worldActors[key].x - camera.x) * camera.scale + 500) / 10;
}

export function CausalWorld({ storyId = 'ads', active = true }: { storyId?: StoryId; active?: boolean }) {
  const reducedMotion = useReducedMotion();
  const story = storyOptions.find((item) => item.id === storyId) ?? storyOptions[0];
  const participants = storyParticipants[story.id];
  const playbook = storyPlaybooks[story.id];
  const stages = useMemo(() => getAcvmStages(story), [story]);
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [failure, setFailure] = useState(false);
  const [reveal, setReveal] = useState(66);
  const [focusedActor, setFocusedActor] = useState<ActorKey | null>(null);
  const current = stages[stage];
  const anomaly = anomalies[story.id];
  const camera = cameraByStage[current.key] ?? cameraByStage.evidence;

  const actors: Record<ActorKey, { name: string; role: string; type: string; icon: IconName }> = {
    initiator: { ...participants.initiator, type: '发起与付款方', icon: 'fingerprint' },
    operator: { ...participants.operator, type: '业务执行方', icon: 'bolt' },
    evidence: { ...participants.evidence, type: '真实业务现场', icon: 'terminal' },
    acvm: { name: 'ACVM Agent', role: '按合约身份调用工具、核验证据并落实安全决定', type: '可信执行方', icon: 'shield' },
    ledger: { name: `${story.nodes[0]}节点 · ${story.nodes[1]}节点 · 审计节点`, role: '共同确认执行事实，原始业务数据不上链', type: '联盟账本', icon: 'chain' },
  };

  useEffect(() => {
    if (!active || !playing || reducedMotion || failure) return;
    const timer = window.setTimeout(() => setStage((value) => (value + 1) % stages.length), 5600);
    return () => window.clearTimeout(timer);
  }, [active, failure, playing, reducedMotion, stage, stages.length]);

  useEffect(() => {
    if (!active) return;
    setStage(0);
    setPlaying(true);
    setFailure(false);
    setReveal(66);
    setFocusedActor(null);
  }, [active, storyId]);

  const selectStage = (next: number) => {
    setStage(Math.max(0, Math.min(stages.length - 1, next)));
    setPlaying(false);
    setFocusedActor(null);
  };

  const toggleAnomaly = () => {
    if (failure) {
      setFailure(false);
      setStage(4);
      return;
    }
    setFailure(true);
    setStage(4);
    setPlaying(false);
    setReveal((value) => Math.max(value, 72));
    setFocusedActor(null);
  };

  const shownState = failure
    ? {
        fund: '冻结，不执行',
        evidence: anomaly.signal,
        authority: 'BLOCK 已落实',
        ledger: '异常证明已留存',
      }
    : current.state;

  const outcome = failure ? anomaly.response : current.success;
  const actorKeys = current.actors as ActorKey[];

  return (
    <div
      className={`causal-replay causal-replay--${current.key} ${failure ? 'causal-replay--failure' : ''}`}
      style={{ '--lens': `${reveal}%`, '--progress': `${stage / (stages.length - 1) * 100}%` } as React.CSSProperties}
      data-testid="causal-world"
    >
      <header className="causal-toolbar">
        <div>
          <span><i /> LIVE CONTRACT</span>
          <strong>拖动时间，观察整笔业务怎样完成</strong>
        </div>
        <div className="causal-toolbar-actions">
          <span>{playbook.subject}</span>
          <button
            type="button"
            onClick={() => reducedMotion ? selectStage((stage + 1) % stages.length) : setPlaying((value) => !value)}
            aria-label={reducedMotion ? '播放下一幕' : playing ? '暂停动画' : '继续动画'}
          >
            <Icon name={reducedMotion || !playing ? 'play' : 'pause'} />
            {reducedMotion ? '下一幕' : playing ? '暂停' : '继续'}
          </button>
        </div>
      </header>

      <section className="causal-stage" aria-label={`${story.title}可交互业务世界`}>
        <BusinessWorldCanvas
          story={story}
          stageKey={current.key}
          stageIndex={stage}
          actorKeys={actorKeys}
          failure={failure}
          reveal={reveal}
          active={active}
        />

        <div className="causal-layer-label causal-layer-label--trusted"><Icon name="eye" /><span><small>ACVM 信任层</small><strong>身份、授权、证据和控制都在现场</strong></span></div>
        <div className="causal-layer-label causal-layer-label--legacy"><Icon name="eye" /><span><small>传统合约视野</small><strong>只收到 result = true</strong></span></div>

        <input
          className="causal-lens-input"
          type="range"
          min="18"
          max="92"
          value={reveal}
          onChange={(event) => {
            setReveal(Number(event.target.value));
            setPlaying(false);
          }}
          aria-label="拖动信任透镜，对比 ACVM 与传统合约能看见的业务范围"
        />
        <div className="causal-lens-handle" aria-hidden="true"><span><Icon name="eye" /> 拖动看差异</span></div>

        {(Object.keys(actors) as ActorKey[]).map((key) => {
          const position = projectedActorPosition(key, camera);
          const visible = position > -2 && position < 102 && (key !== 'acvm' || position < reveal - 1);
          return (
            <button
              type="button"
              key={key}
              className={`causal-actor causal-actor--${key} ${actorKeys.includes(key) ? 'is-active' : ''} ${focusedActor === key ? 'is-focused' : ''}`}
              style={{ '--actor-x': `${position}%`, opacity: visible ? undefined : 0, pointerEvents: visible ? undefined : 'none' } as React.CSSProperties}
              onClick={() => {
                setFocusedActor((value) => value === key ? null : key);
                setPlaying(false);
              }}
              aria-label={`查看${actors[key].name}的责任`}
              aria-pressed={focusedActor === key}
            >
              <i><Icon name={actors[key].icon} /></i>
              <span><small>{actors[key].type}</small><strong>{actors[key].name}</strong></span>
            </button>
          );
        })}

        <button type="button" className={`causal-anomaly ${failure ? 'is-active' : ''}`} onClick={toggleAnomaly} aria-pressed={failure}>
          <Icon name={failure ? 'check' : 'bolt'} />
          <span><small>{failure ? '异常已经进入现场' : '改变现场，看看会发生什么'}</small><strong>{failure ? '恢复真实数据' : anomaly.action}</strong></span>
        </button>

        {focusedActor ? (
          <aside className="causal-actor-callout" aria-live="polite">
            <Icon name={actors[focusedActor].icon} />
            <p><small>{actors[focusedActor].type}</small><strong>{actors[focusedActor].name}</strong><span>{actors[focusedActor].role}。{actorKeys.includes(focusedActor) ? `此刻正在参与“${current.label}”。` : '此刻等待其他参与方完成动作。'}</span></p>
            <button type="button" onClick={() => setFocusedActor(null)} aria-label="关闭角色说明">×</button>
          </aside>
        ) : null}
      </section>

      <section className="causal-explanation" aria-live="polite">
        <div className="causal-scene-copy">
          <span>SCENE {String(stage + 1).padStart(2, '0')} / {String(stages.length).padStart(2, '0')} · {current.phase}</span>
          <h3>{current.title}</h3>
          <p>{current.detail}</p>
        </div>
        <div className="causal-verdict">
          <div><small>ACVM 此刻判断</small><p>{current.rule}</p></div>
          <div className={failure ? 'is-blocked' : 'is-allowed'}><Icon name={failure ? 'shield' : 'check'} /><p><small>{failure ? '已拦截 · AnySentry → ACVM' : '本幕结果'}</small><strong>{outcome}</strong></p></div>
        </div>
      </section>

      <div className="causal-state" aria-label="业务世界实时状态">
        <span><Icon name="receipt" /><small>资金</small><strong>{shownState.fund}</strong></span>
        <span><Icon name="eye" /><small>证据</small><strong>{shownState.evidence}</strong></span>
        <span><Icon name="shield" /><small>权限</small><strong>{shownState.authority}</strong></span>
        <span><Icon name="chain" /><small>联盟账本</small><strong>{shownState.ledger}</strong></span>
      </div>

      <footer className="causal-scrubber">
        <label>
          <span><Icon name="play" /> 拖动业务时间</span>
          <input
            type="range"
            min="0"
            max={stages.length - 1}
            step="1"
            value={stage}
            onChange={(event) => selectStage(Number(event.target.value))}
            aria-label="拖动业务时间轴"
          />
        </label>
        <nav aria-label="端到端业务场景">
          {stages.map((item, index) => (
            <button type="button" key={item.key} className={index === stage ? 'is-active' : index < stage ? 'is-passed' : ''} onClick={() => selectStage(index)}>
              <i>{index < stage ? <Icon name="check" /> : index + 1}</i><span>{item.label}</span>
            </button>
          ))}
        </nav>
      </footer>
    </div>
  );
}
