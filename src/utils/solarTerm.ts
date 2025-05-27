import { XL0_xzb, nutB, dt_at, XL0 } from "@/assets/dict/ephemerisData";
import { solar_terms_dict } from "@/assets/dict/zodiacData";

const rad = (180 * 3600) / Math.PI;
const pi2 = Math.PI * 2;
const J2000 = 2451545;
//每弧度的角秒数
const radd = 180 / Math.PI;

/* ---------------------------------------节气时分--------------------------------------- */

function jd_timeStr(jd) {
  let h, m, s;
  jd += 0.5;
  jd = jd - Math.floor(jd);
  s = Math.floor(jd * 86400 + 0.5);
  h = Math.floor(s / 3600);
  s -= h * 3600;
  m = Math.floor(s / 60);
  s -= m * 60;
  h = "0" + h;
  m = "0" + m;
  s = "0" + s;
  return (
    h.substr(h.length - 2, 2) +
    ":" +
    m.substr(m.length - 2, 2) +
    ":" +
    s.substr(s.length - 2, 2)
  );
}

function qi_accurate(W) {
  let t = S_aLon_t(W) * 36525;
  return t - dt_T(t) + 8 / 24;
}

function S_aLon_t(W) {
  //已知太阳视黄经反求时间
  let t,
    v = 628.3319653318;
  t = (W - 1.75347 - Math.PI) / v;
  v = E_v(t);
  //v的精度0.03%，详见原文
  t += (W - S_aLon(t, 10)) / v;
  v = E_v(t);
  //再算一次v有助于提高精度,不算也可以
  t += (W - S_aLon(t, -1)) / v;
  return t;
}

function E_v(t) {
  //地球速度,t是世纪数,误差小于万分3
  let f = 628.307585 * t;
  return (
    628.332 +
    21 * Math.sin(1.527 + f) +
    0.44 * Math.sin(1.48 + f * 2) +
    0.129 * Math.sin(5.82 + f) * t +
    0.00055 * Math.sin(4.21 + f) * t * t
  );
}

function S_aLon(t, n) {
  //太阳视黄经
  return E_Lon(t, n) + nutationLon2(t) + gxc_sunLon(t) + Math.PI;
  //注意，这里的章动计算很耗时
}

//星历函数(日月球面坐标计算)

function E_Lon(t, n) {
  return XL0_calc(0, 0, t, n);
}

function XL0_calc(xt, zn, t, n) {
  //xt星体,zn坐标号,t儒略世纪数,n计算项数
  t /= 10;
  //转为儒略千年数
  let i,
    j,
    v = 0,
    tn = 1,
    c;
  let F = XL0[xt],
    n1,
    n2,
    N;
  let n0,
    pn = zn * 6 + 1,
    N0 = F[pn + 1] - F[pn];
  //N0序列总数
  for (i = 0; i < 6; i++, tn *= t) {
    (n1 = F[pn + i]), (n2 = F[pn + 1 + i]), (n0 = n2 - n1);
    if (!n0) continue;
    if (n < 0) N = n2;
    //确定项数
    else {
      N = Math.floor((3 * n * n0) / N0 + 0.5) + n1;
      if (i) N += 3;
      if (N > n2) N = n2;
    }
    for (j = n1, c = 0; j < N; j += 3)
      c += F[j] * Math.cos(F[j + 1] + t * F[j + 2]);
    v += c * tn;
  }
  v /= F[0];
  if (xt == 0) {
    //地球
    let t2 = t * t,
      t3 = t2 * t;
    //千年数的各次方
    if (zn == 0) v += (-0.0728 - 2.7702 * t - 1.1019 * t2 - 0.0996 * t3) / rad;
    if (zn == 1) v += (+0.0 + 0.0004 * t + 0.0004 * t2 - 0.0026 * t3) / rad;
    if (zn == 2)
      v += (-0.002 + 0.0044 * t + 0.0213 * t2 - 0.025 * t3) / 1000000;
  } else {
    //其它行星
    let dv = XL0_xzb[(xt - 1) * 3 + zn];
    if (zn == 0) v += (-3 * t) / rad;
    if (zn == 2) v += dv / 1000000;
    else v += dv / rad;
  }
  return v;
}

function nutationLon2(t) {
  //只计算黄经章动
  let i,
    a,
    t2 = t * t,
    dL = 0,
    B = nutB;
  for (i = 0; i < B.length; i += 5) {
    if (i == 0) a = -1.742 * t;
    else a = 0;
    dL += (B[i + 3] + a) * Math.sin(B[i] + B[i + 1] * t + B[i + 2] * t2);
  }
  return dL / 100 / rad;
}

//返回朔日的编号,jd应在朔日附近，允许误差数天
function gxc_sunLon(t) {
  //太阳光行差,t是世纪数
  let v = -0.043126 + 628.301955 * t - 0.000002732 * t * t;
  //平近点角
  let e = 0.016708634 - 0.000042037 * t - 0.0000001267 * t * t;
  return (-20.49552 * (1 + e * Math.cos(v))) / rad;
  //黄经光行差
}

function dt_T(t) {
  return dt_calc(t / 365.2425 + 2000) / 86400.0;
}

//二次曲线外推
function dt_calc(y) {
  //计算世界时与原子时之差,传入年
  let y0 = dt_at[dt_at.length - 2];
  //表中最后一年
  let t0 = dt_at[dt_at.length - 1];
  //表中最后一年的deltatT
  if (y >= y0) {
    let jsd = 31;
    //sjd是y1年之后的加速度估计。瑞士星历表jsd=31,NASA网站jsd=32,skmap的jsd=29
    if (y > y0 + 100) return dt_ext(y, jsd);
    let v = dt_ext(y, jsd);
    //二次曲线外推
    let dv = dt_ext(y0, jsd) - t0;
    //ye年的二次外推与te的差
    return v - (dv * (y0 + 100 - y)) / 100;
  }
  let i,
    d = dt_at;
  for (i = 0; i < d.length; i += 5) if (y < d[i + 5]) break;
  let t1 = ((y - d[i]) / (d[i + 5] - d[i])) * 10,
    t2 = t1 * t1,
    t3 = t2 * t1;
  return d[i + 1] + d[i + 2] * t1 + d[i + 3] * t2 + d[i + 4] * t3;
}

function dt_ext(y, jsd) {
  let dy = (y - 1820) / 100;
  return -20 + jsd * dy * dy;
}

function toJD(jd) {
  return JD(jd.Y, jd.M, jd.D + ((jd.s / 60 + jd.m) / 60 + jd.h) / 24);
}

//日期元件
function JD(y, m, d) {
  //公历转儒略日
  let n = 0,
    G = 0;
  if (y * 372 + m * 31 + Math.floor(d) >= 588829) G = 1;
  //判断是否为格里高利历日1582*372+10*31+15
  if (m <= 2) (m += 12), y--;
  if (G) (n = Math.floor(y / 100)), (n = 2 - n + Math.floor(n / 4));
  //加百年闰
  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    d +
    n -
    1524.5
  );
}

//儒略日数转公历
function DD(jd) {
  let r: any = new Object();
  let D = Math.floor(jd + 0.5),
    F = jd + 0.5 - D,
    c;
  //取得日数的整数部份A及小数部分F
  if (D >= 2299161)
    (c = Math.floor((D - 1867216.25) / 36524.25)),
      (D += 1 + c - Math.floor(c / 4));
  D += 1524;
  r.Y = Math.floor((D - 122.1) / 365.25);
  //年数
  D -= Math.floor(365.25 * r.Y);
  r.M = Math.floor(D / 30.601);
  //月数
  D -= Math.floor(30.601 * r.M);
  r.D = D;
  //日数
  if (r.M > 13) (r.M -= 13), (r.Y -= 4715);
  else (r.M -= 1), (r.Y -= 4716);
  //日的小数转为时分秒
  F *= 24;
  r.h = Math.floor(F);
  F -= r.h;
  F *= 60;
  r.m = Math.floor(F);
  F -= r.m;
  F *= 60;
  r.s = F;
  return r;
}

/**
 * 计算节气分隔时间入口
 */
export function getSolarTermInfo(y, m) {
  y = parseInt(y);
  m = parseInt(m);
  let w, d, D, xn;
  let obj = {};
  let jd = {
    Y: y,
    M: m,
    D: 1,
    h: 12,
    m: 0,
    s: 0.1,
  };
  let Bd0 = Math.floor(toJD(jd)) - J2000; //公历月首,中午
  jd.M++;
  if (jd.M > 12) {
    jd.Y++;
    jd.M = 1;
  }
  let Bdn = Math.floor(toJD(jd)) - J2000 - Bd0; //本月天数(公历)

  let jd2 = Bd0 + dt_T(Bd0) - 8 / 24;

  let lun: any[] = [];
  for (let i = 0; i < Bdn; i++) {
    let d0 = Bd0 + i;
    let r = DD(d0 + J2000);
    lun.push(r);
  }

  w = S_aLon(jd2 / 36525, 3);
  w = (Math.floor(((w - 0.13) / pi2) * 24) * pi2) / 24;

  do {
    d = qi_accurate(w);
    D = Math.floor(d + 0.5);
    xn = Math.floor((w / pi2) * 24 + 24000006.01) % 24;
    w += pi2 / 24;
    if (D >= Bd0 + Bdn) break;
    if (D < Bd0) continue;
    let solarTerm = solar_terms_dict[xn];
    let ob = lun[D - Bd0];
    let time = jd_timeStr(d);
    obj[solarTerm] = `${y}-${m}-${ob.D} ${time}`;
  } while (D + 12 < Bd0 + Bdn);

  return obj;
}

/* ---------------------------------------真太阳时--------------------------------------- */

/**
 * 真太阳时计算入口
 */
export function getRealSolarTime(y, m, d, hms, longitude) {
  y = parseInt(y);
  m = parseInt(m);
  d = parseInt(d);

  let curTZ = -8;
  let t = timeStr2hour(hms);
  let jd = JD(y, m, d + t / 24);
  const bz_zty = mingLiBaZi(jd + curTZ / 24 - J2000, longitude / radd);
  return bz_zty;
}

function timeStr2hour(s) {
  //时间串转为小时
  var a, b, c;
  s = String(s).replace(/[^0-9:\.]/g, "");
  s = s.split(":");
  if (s.length == 1)
    (a = s[0].substr(0, 2) - 0),
      (b = s[0].substr(2, 2) - 0),
      (c = s[0].substr(4, 2) - 0);
  else if (s.length == 2) (a = s[0] - 0), (b = s[1] - 0), (c = 0);
  else (a = s[0] - 0), (b = s[1] - 0), (c = s[2] - 0);
  return a + b / 60 + c / 3600;
}

/**
 * jd为格林尼治UT(J2000起算),J为本地经度
 */
function mingLiBaZi(jd, J) {
  let jd2 = jd + dt_T(jd); //力学时
  jd += pty_zty2(jd2 / 36525) + J / Math.PI / 2; //本地真太阳时(使用低精度算法计算时差)
  let bz_zty = jd_timeStr(jd);
  // var w = S_aLon(jd2 / 36525, -1); //此刻太阳视黄经
  // var k = Math.floor(((w / pi2) * 360 + 45 + 15 * 360) / 30); //1984年立春起算的节气数(不含中气)
  // jd += 13 / 24; //转为前一日23点起算(原jd为本日中午12点起算)
  // var D = Math.floor(jd),
  //   SC = Math.floor((jd - D) * 12); //日数与时辰
  // var vy = Math.floor(k / 12 + 6000000);
  // var vm = k + 2 + 60000000;
  // var vd = D - 6 + 9000000;
  // var vh = (D - 1) * 12 + 90000000 + SC;
  // const ganzhi = {
  //   yearGan: gan_dict[vy % 10],
  //   yearZhi: zhi_dict[vy % 12],
  //   monthGan: gan_dict[vm % 10],
  //   monthZhi: zhi_dict[vm % 12],
  //   dayGan: gan_dict[vd % 10],
  //   dayZhi: zhi_dict[vd % 12],
  //   hourGan: gan_dict[vh % 10],
  //   hourZhi: zhi_dict[vh % 12],
  // };
  // console.log(ganzhi);
  return bz_zty;
}

function pty_zty2(t) {
  //时差计算(低精度),误差约在1秒以内,t力学时儒略世纪数
  var L =
    (1753470142 + 628331965331.8 * t + 5296.74 * t * t) / 1000000000 + Math.PI;
  var z = new Array();
  var E = (84381.4088 - 46.836051 * t) / rad;
  (z[0] = XL0_calc(0, 0, t, 5) + Math.PI), (z[1] = 0);
  //地球坐标
  z = llrConv(z, E);
  //z太阳地心赤道坐标
  L = rad2rrad(L - z[0]);
  return L / pi2;
  //单位是周(天)
}

function llrConv(JW, E) {
  //球面坐标旋转
  //黄道赤道坐标变换,赤到黄E取负
  var r = new Array(),
    J = JW[0],
    W = JW[1];
  r[0] = Math.atan2(
    Math.sin(J) * Math.cos(E) - Math.tan(W) * Math.sin(E),
    Math.cos(J)
  );
  r[1] = Math.asin(
    Math.cos(E) * Math.sin(W) + Math.sin(E) * Math.cos(W) * Math.sin(J)
  );
  r[2] = JW[2];
  r[0] = rad2mrad(r[0]);
  return r;
}

function rad2mrad(v) {
  //对超过0-2PI的角度转为0-2PI
  v = v % (2 * Math.PI);
  if (v < 0) return v + 2 * Math.PI;
  return v;
}

function rad2rrad(v) {
  //对超过-PI到PI的角度转为-PI到PI
  v = v % (2 * Math.PI);
  if (v <= -Math.PI) return v + 2 * Math.PI;
  if (v > Math.PI) return v - 2 * Math.PI;
  return v;
}
