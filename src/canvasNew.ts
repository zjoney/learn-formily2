import moment from 'moment';

// const anchors = [...Array(98).keys()].map((_: any, index) => ({
//   id: index + 1,
//   accountName: `张三${index + 1}`,
//   liveEvents: Math.ceil(Math.random() * 20),
//   zhuboType: index <= 30 ? 2 : 3,
// }));

export default class NewDrawPicture {
  public title: string;

  private colorMap: Record<string, string>;

  private subTitle: string;

  private subHeight: number;

  private listLineHeight: number;

  private listStartY: number;

  private date: string | Date;

  private data: Record<string, any>[];

  private list: Record<string, any>[];

  private listLen: number;

  private listMarginTop: number;

  private listTextMarginLeft: number;

  private listPaddingBottom: number;

  private listItemMaxWidth: number;

  private fontFamily: string;

  private percentage: number;

  private width: number;

  private titleHeight: number;

  private signHeight: number;

  private weekHight: number;

  private weekItemHeight: number;

  private lineTextHeight: number;

  private cellMinHeight: number;

  private cellPadding: number;

  private logoHeight: number;

  private maxHeight: number;

  private weekLinehight: Map<string, number>;

  private padding: number;

  private colWidth: number;

  private maxWeek: number[];

  private weekDays: string[];

  private map: Map<number | string, Record<string, string | number>[]>;

  private weekLength: number;

  private canvas: any;

  private ctx: any;

  constructor(id: string, date: string | Date, config: any = {}) {
    this.date = new Date(date);
    // 日历数据
    this.data = config.schedulingPlanEventList || [];
    // 列表数据
    this.list = config.liveEventDataList || [];
    // 列表一分为二最大长度
    this.listLen = 0;
    // 字体
    this.fontFamily = 'PingFang SC';
    // 颜色值对象
    this.colorMap = {
      c999999: '#999999', // 非本月日历number颜色
      c333333: '#333333', // 普通
      cFfffff: '#ffffff', // 标题颜色
      c485FE9: '#485FE9', // 明星高亮
      c465EEF: '#465EEF', // 周6，周日颜色
      cF6F8FC: '#F6F8FC', // 日历每一行头部颜色
      cEFF0FB: '#EFF0FB', // 列表背景颜色
      cD9DCFA: '#D9DCFA', // 列表中间分割线颜色
      cFF4906: '#FF4906', // 快手标识
      c170B1A: '#170B1A', // 抖音标识
    };
    // 列表 paddingBottom
    this.listPaddingBottom = 30;
    this.map = new Map();
    // 画布宽度
    this.width = 750;
    // 宽度百分比
    this.percentage = 0.8;
    // 标题的高度 120 原始高度  + 60 刘海高度
    this.titleHeight = 180;
    // 周日~周六高度
    this.weekHight = 87;
    // 每列周几对应的高度
    this.weekItemHeight = 40;
    // 每一行文字的高度
    this.lineTextHeight = 30;
    this.cellMinHeight = 100;
    // 每个单元格上下间距
    this.cellPadding = 20;
    // logo 高度，及其上下48间距
    this.logoHeight = 144;
    // 标题
    this.title = `${new Date(date).getMonth() + 1}月排班`;
    // 列表标题
    this.subTitle = '本月场次统计';
    // 四个图标的高度
    this.signHeight = 50;
    // 副标题高度
    this.subHeight = 80;
    // 列表每一行的高度
    this.listLineHeight = 54;
    // 列表Y轴起点坐标
    this.listStartY = 0;
    // 列表高度距离日历表高度
    this.listMarginTop = 60;
    // 列表文字，左边距
    this.listTextMarginLeft = 30;
    // 列表中每一行文字最大宽度
    this.listItemMaxWidth = 176;
    // 最大高度, 初始化
    this.maxHeight = this.titleHeight + this.weekHight;
    // 存储对应文字Y坐标
    this.weekLinehight = new Map();
    // 左边余留宽度30
    this.padding = 30;
    // 共7列，每列的宽度
    // eslint-disable-next-line radix
    this.colWidth = parseInt(String((this.width - this.padding * 2) / 7));
    // 每周的长度
    this.weekLength = 5;

    this.maxWeek = [0, 1, 2, 3, 4, 5];
    this.weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

    this.canvas = document.getElementById(id);

    if (this.canvas !== null) {
      this.ctx = this.canvas.getContext('2d');
    }

    this.arrayToMultiple(this.list);
  }

  private arrayToMultiple(list: Record<string, any>[]): void {
    const middleIndex = Math.ceil(list.length / 2);
    const leftArray = list.splice(0, middleIndex);
    const rigthArray = list.splice(-middleIndex);
    this.list = [leftArray, rigthArray];
    this.listLen = Math.max(leftArray.length, rigthArray.length);
  }

  /**
   * 获取后台返回的数据每天是当前周的第几天
   * @param {*} date
   */
  // eslint-disable-next-line class-methods-use-this
  private getCurrentDayOfWeek(date: Date): number {
    const currentDay = new Date(date);
    const theSaturday = currentDay.getDate() + (6 - currentDay.getDay());
    return Math.ceil(theSaturday / 7);
  }

  /**
   * 计算每一行文字的高度，
   * 若该周单元格为空，则取默认
   * @param {*} num
   */
  private calculItemWeekHeight(num: number): number {
    const { cellMinHeight, lineTextHeight, cellPadding, weekItemHeight } = this;
    // 每一行的具体高度
    const lineHeight = cellPadding * 2 + num * lineTextHeight + weekItemHeight;
    return lineHeight < cellMinHeight ? cellMinHeight : lineHeight;
  }

  /**
   * 计算每一行高度
   * @param {*} weekMap
   */
  private calculEveryWeekHeight(weekMap: { [x: string]: any[] }): void {
    Object.keys(weekMap).forEach((key: string) => {
      // eslint-disable-next-line no-param-reassign
      weekMap[key] = weekMap[key].sort((a: number, b: number) => b - a);
      this.maxHeight += this.calculItemWeekHeight(weekMap[key][0] || 0);
      this.weekLinehight.set(key, this.maxHeight);
    });

    // set 列表Y轴起始坐标位置
    this.listStartY = this.maxHeight + this.listMarginTop;
  }

  /**
   * 设置画布背景颜色
   */
  private setBackgroundColor(): void {
    const { ctx, width, maxHeight, logoHeight } = this;
    const imageData = ctx.getImageData(0, 0, width, maxHeight + logoHeight);
    for (let i = 0; i < imageData.data.length; i += 4) {
      // 当该像素是透明的,则设置成白色
      if (imageData.data[i + 3] === 0) {
        imageData.data[i] = 255;
        imageData.data[i + 1] = 255;
        imageData.data[i + 2] = 255;
        imageData.data[i + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  private zero = (num: number): string | number => (num <= 9 ? `0${num}` : num);

  private empty(): any[] {
    const dayNum = moment(this.date).daysInMonth();
    const emptyMonth = [];
    const d = new Date(this.date);
    const y = d.getFullYear();
    const m = this.zero(d.getMonth() + 1);
    if (this.data.length === 0) {
      // eslint-disable-next-line no-plusplus
      for (let i = 1; i <= dayNum; i++) {
        emptyMonth.push({
          liveDate: `${y}-${m}-${this.zero(i)}`,
          schedulingPlanList: [],
        });
      }
    }
    return emptyMonth;
  }

  private arrayToMap(newDtoList: string | any[]): void {
    // eslint-disable-next-line no-param-reassign
    if (!Array.isArray(newDtoList) || newDtoList.length === 0) newDtoList = this.empty();
    const map = new Map();
    const weekMap: { [x: string]: any[] } = {};

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < newDtoList.length; i++) {
      const item = newDtoList[i];
      if (item.liveDate && typeof item.liveDate === 'string') {
        const date = new Date(item.liveDate.replace(/-/g, '/'));
        const d = date.getDate();
        map.set(d, item.schedulingPlanList || []);
        const wD = this.getCurrentDayOfWeek(date);
        if ((item.schedulingPlanList || []).length > 0) {
          if (!weekMap[String(wD)]) {
            weekMap[String(wD)] = [(item.schedulingPlanList || []).length];
          } else {
            weekMap[String(wD)].push((item.schedulingPlanList || []).length);
          }
        } else {
          weekMap[String(wD)] = [0];
        }
      }
    }

    // eslint-disable-next-line no-plusplus
    for (let i = 1; i < this.maxWeek.length; i++) {
      weekMap[i] = typeof weekMap[i] === 'undefined' ? [] : weekMap[i];
    }

    this.map = map;

    this.weekLength = Object.keys(weekMap).length;

    this.calculEveryWeekHeight(weekMap);
  }

  private calculListHeight(): void {
    this.maxHeight += this.subHeight + this.listMarginTop;
    const listHeight = this.listLen * this.listLineHeight;

    this.maxHeight += this.listPaddingBottom;
    this.maxHeight += listHeight;
  }

  private before(): void {
    this.arrayToMap(this.data);

    // ---- 开始 2021-11-04 canvas 尾部添加列表 计算列表的高度-----
    this.calculListHeight();
    // ---- 结束 -----

    this.canvas.height = this.maxHeight + this.logoHeight;

    this.setBackgroundColor();
  }

  private drawTitle(): void {
    const { ctx, title, titleHeight, width, fontFamily } = this;
    ctx.beginPath();
    ctx.fillStyle = this.colorMap.c485FE9;
    ctx.fillRect(0, 0, width, titleHeight);

    ctx.fillStyle = this.colorMap.cFfffff;
    ctx.font = `40px ${fontFamily}`;
    ctx.textBaseline = 'middle';
    const titleWidth = ctx.measureText(title).width;
    ctx.fillText(title, (width - titleWidth) / 2, 108);
    ctx.closePath();
  }

  private drawSign(): void {
    const { ctx, titleHeight, fontFamily } = this;
    ctx.beginPath();
    ctx.fillStyle = this.colorMap.c333333;
    ctx.font = `20px ${fontFamily}`;
    ctx.textBaseline = 'middle';
    ctx.fillText('账单', 450, titleHeight + 40);
    ctx.fillText('药房', 530, titleHeight + 40);
    ctx.fillText('知识库', 690, titleHeight + 40);

    ctx.fillStyle = this.colorMap.c485FE9;
    ctx.fillText('药理', 610, titleHeight + 40);
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = this.colorMap.cFF4906;
    ctx.arc(440, titleHeight + 42, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(520, titleHeight + 42, 4, 0, 2 * Math.PI);
    ctx.fillStyle = this.colorMap.c170B1A;
    ctx.fill();
    ctx.closePath();
  }

  // 画副标题
  private drawSubTitle(): void {
    const { ctx, title, subTitle, width, fontFamily, padding, listStartY, subHeight } = this;
    ctx.beginPath();
    ctx.fillStyle = this.colorMap.c485FE9;
    ctx.fillRect(padding, listStartY, width - padding * 2, subHeight);

    ctx.fillStyle = this.colorMap.cFfffff;
    ctx.font = `32px ${fontFamily}`;
    ctx.textBaseline = 'middle';
    const titleWidth = ctx.measureText(title).width;
    ctx.fillText(subTitle, (width - titleWidth) / 2, listStartY + subHeight / 2);
    ctx.closePath();
  }

  private drawWeek(): void {
    const { ctx, weekDays, colWidth, titleHeight, padding, fontFamily, signHeight } = this;

    weekDays.forEach((item: unknown, x: number) => {
      ctx.beginPath();
      if (x === 0 || x === 6) {
        ctx.fillStyle = this.colorMap.c465EEF;
      } else {
        ctx.fillStyle = 'black';
      }
      ctx.font = `22px ${fontFamily}`;
      ctx.textBaseline = 'middle';
      ctx.fillText(item, x * colWidth + padding + 20, titleHeight + 56 + signHeight);
      ctx.closePath();
    });
  }

  private drawHeader(): void {
    this.drawTitle();
    this.drawWeek();
  }

  private angleToRadian = (angle: number): number => (Math.PI / 180) * angle;

  private drawCell(): void {
    const { angleToRadian, ctx, width, weekLinehight, weekItemHeight, padding, maxWeek, titleHeight, weekHight } = this;
    maxWeek.forEach((item: number) => {
      if (item === 5 && this.weekLength === 5) {
        return;
      }
      const lineHeight = weekLinehight.get(String(item)) || titleHeight + weekHight;
      ctx.beginPath();
      ctx.fillStyle = this.colorMap.cF6F8FC;
      const x1 = padding + weekItemHeight / 2;
      const x2 = width - padding - weekItemHeight / 2;
      const y = lineHeight + weekItemHeight / 2;
      ctx.arc(x1, y, 20, angleToRadian(-90), angleToRadian(90), true);
      ctx.arc(x2, y, 20, angleToRadian(90), angleToRadian(-90), true);
      ctx.fill();
      ctx.closePath();
    });
  }

  private drawList(): void {
    const { ctx, padding, width, listStartY, subHeight, listLineHeight, listLen, listPaddingBottom } = this;
    const y = listStartY + subHeight;
    // 画背景
    ctx.beginPath();
    ctx.fillStyle = this.colorMap.cEFF0FB;
    ctx.fillRect(padding, y, width - padding * 2, listLen * listLineHeight + listPaddingBottom);
    ctx.closePath();

    // 画中间线 24 是每一行文字距离顶级的高度
    ctx.beginPath();
    ctx.moveTo(width / 2, y + 24);
    ctx.lineWidth = 1;
    ctx.strokeStyle = this.colorMap.cD9DCFA;
    ctx.lineTo(width / 2, y + listLen * listLineHeight);
    ctx.stroke();
    ctx.closePath();
  }

  private calculAnchorProperty(title: string): Record<string, string | number> {
    if (!title) return { title: '', width: 0 };
    const { ctx, colWidth, percentage } = this;
    // eslint-disable-next-line radix
    const maxWdith = parseInt(String(colWidth * percentage));
    let lineWidth = 0;
    let strTitle = '';
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < title.length; i++) {
      const fontWidth = ctx.measureText(title[i]).width;
      lineWidth += fontWidth;
      if (lineWidth <= maxWdith) {
        strTitle += title[i];
      } else {
        strTitle = `${strTitle}...`;
        break;
      }
    }
    return {
      title: strTitle,
      width: lineWidth,
    };
  }

  private fillCellData(): void {
    const {
      ctx,
      colWidth,
      maxWeek,
      weekDays,
      weekLinehight,
      titleHeight,
      weekHight,
      padding,
      map,
      lineTextHeight,
      weekItemHeight,
      cellPadding,
      fontFamily,
    } = this;
    const current = moment(new Date(this.date));
    const currentMonth = current.month(); // 当前日期的月份0-11
    const currentDay = current.date(); // 当前日期是当前月份的几号
    const currentMonthFirstDay = moment(current).subtract(currentDay - 1, 'days'); // 当前月份第一天
    const calendarFirstDay = moment(currentMonthFirstDay).subtract(currentMonthFirstDay.day() + 1, 'days'); // 当前日历第一个日期

    maxWeek.forEach((week: number, x: number) => {
      const weekStartDay = moment(calendarFirstDay).add(week * 7 + 1, 'days');

      const coordinateY = weekLinehight.get(String(maxWeek[x])) || titleHeight + weekHight;
      weekDays.forEach((_: unknown, y: number) => {
        if (!(week === 5 && weekStartDay.month() !== currentMonth)) {
          const day = moment(calendarFirstDay).add(week * 7 + y + 1, 'days');
          const dayNum = day.date();
          const isOhterMonth = day.month() !== currentMonth; // 是否是本月

          ctx.beginPath();
          if (isOhterMonth) {
            ctx.fillStyle = this.colorMap.c999999;
          } else {
            ctx.fillStyle = this.colorMap.c333333;
          }
          const numX = y * colWidth + padding + 36;
          const numY = coordinateY + 20;
          ctx.font = `20px ${fontFamily}`;
          ctx.textBaseline = 'middle';
          ctx.fillText(dayNum, numX, numY);
          ctx.closePath();

          if (!isOhterMonth) {
            const itemList = map.get(dayNum) || [];

            ctx.font = `18px ${fontFamily}`;
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < itemList.length; i++) {
              ctx.beginPath();
              ctx.fillStyle = itemList[i].zhuboType === 2 ? this.colorMap.c485FE9 : this.colorMap.c333333;
              const ctxTitle = itemList[i].accountName;
              const platform = itemList[i]?.platform;
              const { title, width } = this.calculAnchorProperty(String(ctxTitle));
              const textX = y * colWidth + padding + (colWidth - Number(width)) / 2;
              const textY = coordinateY + weekItemHeight + cellPadding + lineTextHeight / 2 + i * lineTextHeight;

              ctx.fillText(title, textX, textY);

              // 1 是快手，2是抖音
              ctx.fillStyle = platform === 1 ? this.colorMap.cFF4906 : this.colorMap.c170B1A;
              ctx.arc(textX - 8, textY, 4, 0, 2 * Math.PI);
              ctx.fill();
              ctx.closePath();
            }
          }
          ctx.closePath();
        }
      });
    });
  }

  private calculListItemAnchorNameMaxWidth(title: string): string {
    if (!title) return '';
    const { ctx } = this;
    let lineWidth = 0;
    let strTitle = '';
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < title.length; i++) {
      const fontWidth = ctx.measureText(title[i]).width;
      lineWidth += fontWidth;
      if (lineWidth <= this.listItemMaxWidth) {
        strTitle += title[i];
      } else {
        strTitle = `${strTitle}...`;
        break;
      }
    }
    return strTitle;
  }

  private fillListData(): void {
    const { ctx, listStartY, listTextMarginLeft, listLineHeight, list, padding, width, fontFamily, subHeight } = this;
    const [leftArray, rightArray] = list;
    ctx.font = `20px ${fontFamily}`;
    ctx.textBaseline = 'middle';

    // eslint-disable-next-line no-plusplus
    for (let x = 0; x < leftArray.length; x++) {
      ctx.beginPath();
      const name = leftArray[x].accountName;
      const val = leftArray[x].liveEvents;
      const platform = leftArray[x]?.platform;
      const textX = padding + listTextMarginLeft;
      const textY = listStartY + subHeight + x * listLineHeight + 35;
      const valX = 282;
      ctx.fillStyle = leftArray[x].zhuboType === 2 ? this.colorMap.c485FE9 : this.colorMap.c333333;
      ctx.fillText(this.calculListItemAnchorNameMaxWidth(name), textX, textY);
      // 1 是快手，2是抖音
      ctx.fillStyle = platform === 1 ? this.colorMap.cFF4906 : this.colorMap.c170B1A;
      ctx.arc(textX - 8, textY, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = this.colorMap.c333333;
      ctx.fillText(val, valX, textY);
      ctx.closePath();
    }

    // eslint-disable-next-line no-plusplus
    for (let x = 0; x < rightArray.length; x++) {
      ctx.beginPath();
      const name = rightArray[x].accountName;
      const platform = rightArray[x]?.platform;
      const val = rightArray[x].liveEvents;
      const textX = width / 2 + listTextMarginLeft;
      const textY = listStartY + subHeight + x * listLineHeight + 35;
      const valX = 627;
      ctx.fillStyle = rightArray[x].zhuboType === 2 ? this.colorMap.c485FE9 : this.colorMap.c333333;
      ctx.fillText(this.calculListItemAnchorNameMaxWidth(name), textX, textY);
      // 1 是快手，2是抖音
      ctx.fillStyle = platform === 1 ? this.colorMap.cFF4906 : this.colorMap.c170B1A;
      ctx.arc(textX - 8, textY, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = this.colorMap.c333333;
      ctx.fillText(val, valX, textY);
      ctx.closePath();
    }
  }

  private drawLogo(): void {
    const { ctx, maxHeight } = this;
    const img = new Image();
    img.src = 'https://yw-supplier.oss-cn-hangzhou.aliyuncs.com/anchor/file/2021/10/4e118486-a449-4f71-b8a1-38eb7379524a.png?Expires=1949148445&OSSAccessKeyId=LTAI4G5gcvEXL7mCUZAWWVU1&Signature=C1DArgcvY34rGkRwLysSfpqaGlY%3D';
    img.setAttribute('crossOrigin', 'Anonymous');
    img.onload = (): void => {
      ctx.drawImage(img, 298, maxHeight + 48);
    };
  }

  // 下载图片
  public dataURL(): void {
    return this.canvas.toDataURL('image/png');
  }

  public init(): void {
    // 处理数据
    this.before();

    // 画头部
    this.drawHeader();

    // 画四个标识
    this.drawSign();

    // 画副标题
    this.drawSubTitle();

    // 画日历表格
    this.drawCell();

    // 画列表
    this.drawList();

    // 表格中填充数据
    this.fillCellData();

    // 列表中填充数据
    this.fillListData();

    // 画logo
    this.drawLogo();
  }
}
