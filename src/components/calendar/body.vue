<template>
  <div class="full-calendar-body"
    @click="hideInfo"
    style="`background-color: 'rgba(0,0,0,0.9)';`">
    <div class="weeks">
      <!-- <div v-for="(val, idx) in currentDates"
        :key="idx"
        v-if="val[0].isCurMonth || val[6].isCurMonth">
        <strong class="week"
          :key="idx"
          v-for="(week, idx) in weekNames">{{week}}</strong>
      </div> -->
      <template v-for="(week, idx) in currentDates">
        <strong class="week"
          :key="`${idx}-${idx2}`"
          v-for="(day, idx2) in week"
          :class="{
              'is-sunday' : !idx2 % 7,
          }"
          v-if="day.isCurMonth">{{weekNames[idx2 % 7]}}</strong>
      </template>
    </div>
    <div class="dates"
      ref="dates">
      <div class="dates-bg">
        <div class="week-row">
          <template v-for="(week, idx) in currentDates"
            v-if="week[0].isCurMonth || week[6].isCurMonth">
            <div class="day-cell"
              :key="`${idx}-${idx2}`"
              v-for="(day, idx2) in week"
              ref="dayCellRef"
              :class="{
              'not-cur-month' : !day.isCurMonth,
              }"
              v-if="day.isCurMonth"
              :style="`z-index:${100 - (idx * 10 + idx2)}`">
              <div class="left-itme-list">
                <p class="day-number"
                  :class="{'today' : day.isToday}"><span>{{day.monthDay}}</span></p>
                <p class="event-item"
                  :key="idx"
                  v-for="(event, idx) in day.events"
                  v-if="day.isCurMonth"
                  :class="[classNames(event.cssClass), {
                  'is-start'   : isStart(event.start, day.date),
                  'is-end'     : isEnd(event.end,day.date),
                  'is-zero'     : event.end == event.start,
                  'is-opacity' : !event.isShow
                  }]"
                  @click="eventClick(event,$event, idx)">
                  <span :class="['name-text', isStart(event.start, day.date) && event.isShow && 'show-name-text' ]"
                    v-if="isStart(event.start, day.date)">{{isBegin(event, day.date, day.weekDay) }}</span>
                  <svg version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    v-if="event.isShow || !isEnd(event.end,day.date)"
                    class="svg-comp">
                    <defs>
                      <linearGradient :id="`leftToRight${computedColor(event.title).join('-')}-${computedOpacity(day.date, event.start, event.end, 'start')}`"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%">
                        <stop offset="0%"
                          :style="`stop-color:rgb(${computedColor(event.title)});
                    stop-opacity:${computedOpacity(day.date, event.start, event.end, 'start')}`" />
                        <stop offset="100%"
                          :style="`stop-color:rgb(${computedColor(event.title)});
                    stop-opacity:${computedOpacity(day.date, event.start, event.end, 'end')}`" />
                      </linearGradient>
                    </defs>
                    <polygon :points="computedPoints(day.date, event.start, event.end)"
                      :style="`fill:url(#leftToRight${computedColor(event.title).join('-')}-${computedOpacity(day.date, event.start, event.end, 'start')})`" />
                  </svg>
                  <!-- <i class="triangle-left" v-if="isStart(event.start, day.date)" :style="`border-color: transparent rgb(${colorArr[idx % 4]}) transparent transparent;`"></i> -->
                  <!-- <i class="triangle-left triangle-left-end" v-if="isEnd(event.end, day.date)" ></i> -->
                </p>
              </div>
              <!-- <div class="right-border"></div> -->
            </div>
          </template>
        </div>

      </div>

      <!-- full events when click show more -->
      <transition name="fade">
        <div class="event-info"
          v-show="showInfo"
          :style="{left: morePos.left + 'px', top: morePos.top + 'px'}">
          <div>施药种类: {{eventInfo.title}} <span class="info-color"
              :style="`background-color: rgb(${infoColor});`"></span></div>
          <div>开始时间: {{eventInfo.start}}</div>
          <div>结束时间: {{eventInfo.end}}</div>
        </div>
      </transition>

      <slot name="body-card">

      </slot>

    </div>
  </div>
</template>
<script type="text/babel">
import dateFunc from './dateFunc';

export default {
  name: 'fcBody',
  props: {
    currentDate: {},
    events: {},
    weekNames: {
      type: Array,
      default() {
        return [];
      },
    },
    monthNames: {},
    firstDay: {},
  },
  created() {
    this.computedColor = this.$getPesticideColor;
    this.localEvents = this.deepClone(this.events).map((item, index) => {
      item.id = item.id || index;
      item.end = item.end || item.start;
      return item;
    });
    // console.log(this.localEvents);
    let _svgs = document.getElementsByClassName('svg-comp');
    setTimeout(() => {
      for (let i = 0; i < _svgs.length; i++) {
        let _sv = _svgs[i];
        _sv.style.width = '100%';
      }
    });
  },
  mounted() {
    this.cellWidth = this.$refs.dayCellRef[0].getBoundingClientRect().width;
    let spanArr = document.getElementsByClassName('show-name-text');
    let scrollSpanArr = [];
    for (let i = 0, len = spanArr.length; i < len; i++) {
      let span = spanArr[i];

      if (span.clientWidth > span.parentElement.clientWidth) {
        scrollSpanArr.push(span);
        // console.log('span.clientWidth');
        // console.log(span.clientWidth);
        // console.log(span.parentElement.clientWidth);
        // console.log('span.clientWidth');
      }
    }
    let status = false;
    if (scrollSpanArr.length)
      setInterval(() => {
        status = !status;
        scrollSpanArr.forEach(span => {
          if (!status) {
            span.style.left = '0px';
            return;
          }
          let gap = span.clientWidth - span.parentElement.clientWidth;
          span.style.left = `-${gap + 2}px`;
        });
      }, 4000);
  },
  data() {
    return {
      // weekNames : DAY_NAMES,
      weekMask: [1, 2, 3, 4, 5, 6, 7],
      spanArr: [],
      isLismit: true,
      eventLimit: 3,
      showInfo: false,
      eventInfo: {},
      localEvents: null,
      morePos: {
        top: 0,
        left: 0,
      },
      selectDay: {},
      infoColor: '',
      colorArr: [[237, 84, 100], [35, 198, 200], [248, 172, 89], [28, 132, 198]],
      cellWidth: 50,
      reload: true,
    };
  },
  computed: {
    currentDates() {
      return this.getCalendar();
    },
  },
  methods: {
    deepClone(obj) {
      let _obj = JSON.stringify(obj),
        objClone = JSON.parse(_obj);
      return objClone;
    },
    isBegin(event, date, index) {
      let st = new Date(event.start);
      if (index == 0 || st.toDateString() == date.toDateString() || date.getDate() === 1) {
        return event.title;
      }
      return '';
    },
    computedDistanceDate(currentDate, startDateStr, endDateStr) {
      const startDay = startDateStr.split('-');
      startDay[1] -= 1;
      const endDay = endDateStr.split('-');
      endDay[1] -= 1;
      // debugger;
      // 全部多少天
      const allDays =
        this.getCurrentDay(new Date(...endDay)) - this.getCurrentDay(new Date(...startDay)) + 1;
      // 距离开始多少天
      const disStart = this.getCurrentDay(currentDate) - this.getCurrentDay(new Date(...startDay));
      return {
        allDays,
        disStart,
      };
    },
    computedOpacity(currentDate, startDateStr, endDateStr, start) {
      if (startDateStr === endDateStr) return 1.0;
      const opcitySection = 0.9;
      const { allDays, disStart } = this.computedDistanceDate(
        currentDate,
        startDateStr,
        endDateStr,
      );
      return start === 'start'
        ? (1 - (opcitySection / allDays) * disStart).toFixed(4)
        : (1 - (opcitySection / allDays) * (disStart + 1)).toFixed(4);
    },
    _computedColor() {
      let colorArr = [[237, 84, 100], [35, 198, 200], [248, 172, 89], [28, 132, 198]];
      let idObj = {};
      let nonius = 0;
      return title => {
        if (idObj[title]) {
          // debugger
          return idObj[title];
        } else {
          nonius++;
          idObj[title] = colorArr[nonius % 4];
          return idObj[title];
        }
      };
    },
    computedPoints(currentDate, startDateStr, endDateStr) {
      const height = 18;
      const minHeight = 6;
      const width = this.cellWidth;
      const disHeight = height - minHeight;
      const { allDays, disStart } = this.computedDistanceDate(
        currentDate,
        startDateStr,
        endDateStr,
      );
      const base = disHeight / allDays / 2;
      const leftY = base * disStart;
      const rightY = base * (disStart + 1);
      // 零天残留不显示
      if (allDays === 1) return '';
      return `0,${leftY} ${width},${rightY} ${width},${18 - rightY} 0,${18 - leftY}`;
    },
    computedTrapezoid(currentDate, startDateStr, endDateStr, direction) {
      const height = 18;
      const minHeight = 6;
      const disHeight = height - minHeight;
      const { allDays, disStart } = this.computedDistanceDate(
        currentDate,
        startDateStr,
        endDateStr,
      );
      const base = disHeight / allDays / 2;
      const distance = base * disStart;
      return direction === 'top'
        ? `height: ${distance}px;border-bottom: ${base}px solid transparent;border-top: 0px solid transparent;`
        : `height: ${distance}px;border-top: ${base}px solid transparent;border-bottom: 0px solid transparent;`;
    },
    getCurrentDay(date) {
      var endDate = new Date(date),
        startDate = new Date(2016, 0, 0),
        days = (endDate - startDate) / 1000 / 60 / 60 / 24;
      return days;
    },
    moreTitle(date) {
      let dt = new Date(date);
      return this.weekNames[dt.getDay()] + ', ' + this.monthNames[dt.getMonth()] + dt.getDate();
    },
    classNames(cssClass) {
      if (!cssClass) return '';
      // string
      if (typeof cssClass == 'string') return cssClass;

      // Array
      if (Array.isArray(cssClass)) return cssClass.join(' ');

      // else
      return '';
    },
    getCalendar() {
      // calculate 2d-array of each month
      // first day of this month
      let now = new Date(); // today
      let current = new Date(this.currentDate);

      let startDate = dateFunc.getStartDate(current); // 1st day of this month

      let curWeekDay = startDate.getDay();

      // begin date of this table may be some day of last month
      let diff = parseInt(this.firstDay) - curWeekDay;
      diff = diff > 0 ? diff - 7 : diff;

      startDate.setDate(startDate.getDate() + diff);
      let calendar = [];

      for (let perWeek = 0; perWeek < 6; perWeek++) {
        let week = [];

        for (let perDay = 0; perDay < 7; perDay++) {
          week.push({
            monthDay: startDate.getDate(),
            isToday: now.toDateString() == startDate.toDateString(),
            isCurMonth: startDate.getMonth() == current.getMonth(),
            weekDay: perDay,
            date: new Date(startDate),
            events: this.slotEvents(startDate),
          });

          startDate.setDate(startDate.getDate() + 1);
          // if (startDate.toDateString() == endDate.toDateString()) {
          //   isFinal = true
          //   break
          // }
        }
        calendar.push(week);
        // if (isFinal) break
      }
      return calendar;
    },
    slotEvents(date) {
      // find all events start from this date
      let cellIndexArr = [];
      // 筛选事件大集合的事件到当前日期
      let thisDayEvents = this.localEvents.filter(day => {
        let dt = new Date(day.start);
        let st = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
        let ed = day.end ? new Date(day.end) : st;
        // // console.log('slotEvt', st, ed, date)
        return date >= st && date <= ed;
      });

      // sort by duration
      thisDayEvents.sort((a, b) => {
        if (!b.cellIndex) return -1;
        if (!a.cellIndex) return 1;
        return a.cellIndex - b.cellIndex;
      });

      // mark cellIndex and place holder
      for (let i = 0; i < thisDayEvents.length; i++) {
        thisDayEvents[i].cellIndex = thisDayEvents[i].cellIndex || i + 1;
        thisDayEvents[i].isShow = true;
        if (thisDayEvents[i].cellIndex == i + 1 || i > 100) continue;
        thisDayEvents.splice(i, 0, {
          title: 'holder',
          cellIndex: i + 1,
          start: dateFunc.format(date, 'yyyy-MM-dd'),
          end: dateFunc.format(date, 'yyyy-MM-dd'),
          isShow: false,
        });
      }
      // debugger
      return thisDayEvents;
    },
    isStart(eventDate, date) {
      let st = new Date(eventDate);
      return st.toDateString() == date.toDateString();
    },
    isEnd(eventDate, date) {
      let ed = new Date(eventDate);
      return ed.toDateString() == date.toDateString();
    },
    selectThisDay(day, jsEvent) {
      this.selectDay = day;
      this.showMore = true;
      this.morePos = this.computePos(event.target);
      this.morePos.top -= 100;
      let events = day.events.filter(item => {
        return item.isShow == true;
      });
      this.$emit('moreclick', day.date, events, jsEvent);
    },
    computePos(target) {
      let eventRect = target.getBoundingClientRect();
      let pageRect = this.$refs.dates.getBoundingClientRect();
      return {
        left: eventRect.left - pageRect.left,
        top: eventRect.top + eventRect.height - pageRect.top,
      };
    },
    dayClick(day, jsEvent) {
      this.$emit('dayclick', day, jsEvent);
    },
    eventClick(event, jsEvent, idx) {
      console.log(event.id);
      console.log(event);

      if (!event.isShow) {
        return;
      }
      const sameDay = event.start === event.end;
      this.infoColor = !sameDay ? this.colorArr[idx % 4] : '0,0,0';
      this.showInfo = true;
      this.eventInfo = event;
      console.log(event);

      this.morePos = this.computePos(jsEvent.target);
      this.morePos.left -= 50;
      if (this.morePos.left < -10) this.morePos.left += 50;
      if (this.morePos.left > 250) this.morePos.left -= 40;
      jsEvent.stopPropagation();
    },
    hideInfo() {
      this.showInfo = false;
    },
  },
};
</script>
<style lang="scss">
$border-color: #c2c2c2;
.full-calendar-body {
  // height: 100%;
  .is-sunday {
    // background-color: #0066cc;
    color: #cc4343 !important;
  }
  svg {
    position: relative;
    display: inline-block;
    height: 18px;
    width: 0%;
    // animation: growing 1s;
    // -webkit-animation: growing 1s; /*Safari and Chrome*/
    // -webkit-animation-fill-mode: forwards;
    transition: width ease-in 0.5s;
  }
  .weeks {
    display: flex;
    & > div {
      display: flex;
      flex: 1;
    }
    .week {
      flex: 1;
      text-align: center;
      // height: 20px;
      line-height: 20px;
      color: #777;
    }
  }
  .dates {
    position: relative;
    height: 100%;
    .dates-bg {
      display: flex;
    }
    .event-item {
      position: relative;
      cursor: pointer;
      font-size: 12px;
      margin-bottom: 2px;
      color: #fff;
      height: 18px;
      line-height: 18px;
      white-space: nowrap;
      overflow: hidden;
      // text-overflow: ellipsis;
      z-index: 2;
      // overflow: hidden;
      // box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.1);
      .name-text {
        position: absolute;
        padding-left: 2px;
        box-sizing: border-box;
        z-index: 100;
        // width: 100%;
        // overflow: hidden;
        left: 0;
        transition: left ease 1.5s;
      }

      &.red {
        color: #fff;
        background-color: rgb(237, 84, 100);
      }
      &.green {
        color: #fff;
        // background-color: rgb(26, 179, 148);
        background-color: rgb(35, 198, 200);
      }
      &.logo {
        color: #fff;
        // background-color: rgb(26, 179, 148);
        background-color: #d2b697;
      }
      &.yellow {
        color: #fff;
        background-color: rgb(248, 172, 89);
      }
      &.blue {
        color: #fff;
        background-color: rgb(28, 132, 198);
      }

      &.is-start {
        // margin-left: 8px;
      }
      &.is-end {
        // margin-right: 4px;
        // opacity: 0;
      }
      &.is-opacity {
        opacity: 0;
      }
      .triangle-left {
        position: absolute;
        top: 0;
        left: -8px;
        display: inline-block;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 9px 8px 9px 0;
        border-color: transparent #007bff transparent transparent;
      }
      .triangle-left-end {
        left: auto;
        right: 0;
        border-width: 9px 15px 9px 0;
        border-color: transparent #fff transparent transparent;
      }
    }
    .is-zero {
      box-sizing: border-box;
      color: #333;
      border: 1px solid #ffac00;
    }
    .week-row {
      display: flex;
      flex: 1;
      .day-cell {
        position: relative;
        flex: 1;
        min-height: 80px;
        padding: 4px 0;
        box-sizing: border-box;
        .day-number {
          box-sizing: border-box;
          padding: 0 4px;
        }
        .left-itme-list {
          z-index: 5;
          position: relative;
        }
        .right-border {
          position: absolute;
          top: 0;
          right: 0;
          width: 1px;
          background-color: #e0e0e0;
          height: 100%;
          z-index: 0;
        }
        .day-number {
          text-align: right;
          transform: scale(1.2);
          span {
            // display: inline-block;
            // width: 20px;
            height: 20px;
            // padding: 0 2px;
            line-height: 20px;
            border-radius: 10px;
            text-align: center;
          }
        }
        .today {
          // color: #fff;

          // // font-size: 20px;

          // background-color: #ed5464;
        }
        &.not-cur-month {
          .day-number {
            color: rgba(0, 0, 0, 0.24);
          }
        }
      }
    }
    .dates-events {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      .events-week {
        display: flex;
        .events-day {
          cursor: pointer;
          flex: 1;
          min-height: 109px;
          overflow: hidden;
          text-overflow: ellipsis;
          .day-number {
            text-align: right;
            padding: 4px 5px 4px 4px;
            opacity: 0;
          }
          &.not-cur-month {
            .day-number {
              color: rgba(0, 0, 0, 0.24);
            }
          }
          .event-box {
            .more-link {
              cursor: pointer;
              // text-align: right;
              padding-left: 8px;
              padding-right: 2px;
              color: rgba(0, 0, 0, 0.38);
              font-size: 14px;
            }
          }
        }
      }
    }
    .event-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: absolute;
      top: 0px;
      left: 0;
      box-sizing: border-box;
      padding: 5px;
      width: 140px;
      height: 60px;
      background-color: #fff;
      box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.1);
      z-index: 999;
      border: 1px solid #e2e2e2;
      color: #777;
      .info-color {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 5px;
        background-color: deeppink;
      }
    }
  }
}
/*0.3像素下划线边框*/

.borderBottom {
  position: relative;
  overflow: hidden;
}

.borderBottom::after {
  content: '';
  position: absolute;
  width: 500%;
  left: 0;
  bottom: -1px;
  right: 0;
  border: 1px solid #e2e2e2;
  -webkit-transform-origin: 0 0;
  -moz-transform-origin: 0 0;
  -ms-transform-origin: 0 0;
  -o-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scale(0.3, 0.3);
  -ms-transform: scale(0.3, 0.3);
  -o-transform: scale(0.3, 0.3);
  transform: scale(0.3, 0.3);
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.thinner-border-right {
  position: relative;
}

.thinner-border-right:before {
  content: '';
  position: absolute;
  width: 500%;
  height: 200%;
  border-right: 1px solid #e2e2e2;
  -webkit-transform-origin: 0 0;
  -moz-transform-origin: 0 0;
  -ms-transform-origin: 0 0;
  -o-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scale(0.5, 0.5);
  -ms-transform: scale(0.5, 0.5);
  -o-transform: scale(0.5, 0.5);
  transform: scale(0.5, 0.5);
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.trapezoid-mask {
  position: absolute;
  left: 0;
  width: 0;
  border-right: 50.58px solid #000;
}
.trapezoid-top-mask {
  top: 0;
}
.trapezoid-bottom-mask {
  bottom: 0px;
}

.weeks {
  border-top: 1px solid $border-color;
  border-bottom: 1px solid $border-color;
  border-left: 1px solid $border-color;
  .week {
    color: #bbb;
    border-right: 1px solid $border-color;
  }
}
.week-row {
  border-left: 1px solid $border-color;
  .day-cell {
    border-right: 1px solid $border-color;
    border-bottom: 1px solid $border-color;
  }
}
</style>
