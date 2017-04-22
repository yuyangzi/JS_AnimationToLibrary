/**
 * Created by 王宜明 on 2017/3/20.
 */
"use strict";

var laodImage = require("./imageLoader");
var Timeline = require("./timeline");

//初始化状态
var STATE_INITIAL = 0;
//开始状态
var STATE_START = 1;
//停止状态
var STATE_STOP = 2;

//同步任务类型
var TASK_SYNC = 0;
//异步任务类型
var TASK_ASYNC = 1;

/**
 *  简单的函数封装,执行callback
 * @param callback 执行函数
 */
function next(callback) {
    callback && callback();
}


/**
 * 帧动画库类
 * @constructor
 */
function Animation() {
    this.taskQueue = [];
    this.index = 0;
    this.timeline = new Timeline();
    this.state = STATE_INITIAL;
}
/**
 * 添加一个同步任务,去预加载图片.
 * @param imageList 图片数组
 */
Animation.prototype.loadImage = function (imageList) {
    var taskFn = function (next) {
        loadImage(imageList.slice(), next);
    };
    var type = TASK_SYNC;
    return this._add(taskFn, type);
};

/**
 * 添加一个异步定时任务,通过定时改变图片的背景位置.实现帧动画
 * @param ele dom对象
 * @param positions 背景位置数组
 * @param imgUrl 图片地址
 */
Animation.prototype.changePositions = function (ele, positions, imgUrl) {
    var len = positions.length;
    var taskFn;
    var type;
    if (len) {
        var me = this;
        taskFn = function (next, time) {
            if (imgUrl) {
                ele.style.backgroundImage = "url(" + imgUrl + ")";
            }
            //获得当前背景图片位置索引.
            var index = Math.min(time / me.interval | 0, len - 1);
            var position = position[index].split(" ");
            //改变DOM对象的背景图片位置
            ele.style.backgroundImage = position[0] + "px " +
                position[1] + "px";
            if (index === len - 1) {
                next();
            }
        };
        type = TASK_ASYNC;
    } else {
        taskFn = next;
        type = TASK_SYNC;
    }
    return this._add(taskFn,type);
};
/**
 *  添加一个异步定时任务,通过改变img标签的src属性来实现帧动画
 * @param ele dom对象
 * @param imgList 图片地址数组
 */
Animation.prototype.changeSrc = function (ele, imgList) {

};
/**
 *  高级用法,添加一个异步定时执行的任务,
 *  该任务自定义动画每帧执行的任务函数
 * @param taskFn 自定义每帧执行的任务函数
 */
Animation.prototype.enterFrame = function (taskFn) {

};

/**
 * 添加一个同步任务,可以在上一个任务完成后执行回调函数
 * @param callback 回调函数
 */
Animation.prototype.then = function (callback) {

};

/**
 *  开始执行任务,异步定义任务执行的间隔。
 * @param interval
 */
Animation.prototype.state = function (interval) {
    if (this.state === STATE_START) {
        return this;
    }
    //如果任务链中没有任务,则返回.
    if (!this.taskQueue.length) {
        return this;
    }
    this.state = STATE_START;
    this.interval = interval;
    this._runTask();
    return this;

};

/**
 *  添加一个同步任务,该任务就是回退到上一个任务,
 *  实现重复上一个任务的效果,可以定义重复次数.
 * @param times 重复次数
 */
Animation.prototype.repeat = function (times) {

};

/**
 *  添加一个同步任务,相当于repeat()更友好的接口,无线循环上一次任务
 */
Animation.prototype.repeatForever = function () {

};

/**
 *  设置当前任务结束后到下一个任务开始前的等待时间
 * @param time 等待时间
 */
Animation.prototype.wait = function (time) {

};

/**
 * 暂停当前异步定时任务
 */
Animation.prototype.pause = function () {

}

/**
 * 重新执行上一次暂停的异步任务
 */
Animation.prototype.restart = function () {

};

/**
 *  释放资源
 */
Animation.prototype.dispose = function () {

};

/**
 *  添加一个任务到任务队列中
 * @param taskFn 任务方法
 * @param type 任务类型
 * @private
 */
Animation.prototype._add = function (taskFn, type) {
    this.taskQueue.push({
        taskFn: taskFn,
        type: type
    });

    return this;
};

/**
 *  执行任务
 * @private
 */
Animation.prototype._runTask = function () {
    if (!this.taskQueue || this.state !== STATE_START) {
        return
    }
    //任务执行完毕
    if (this.index === this.taskQueue.length) {
        this.dispose();
        return;
    }
    //获得任务链上的当前任务
    var task = this.taskQueue[this.index];
    if (task.type === TASK_SYNC) {
        this._syncTask(task);
    } else {
        this._asyncTask(task);
    }
};

/**
 *  同步任务
 * @param task 执行的任务对象
 * @private
 */
Animation.prototype._syncTask = function (task) {
    var me = this;
    var next = function () {
        //切换到下一个任务
        me._next();
    };

    var taskFn = task.taskFn;
    taskFn(next);
};

/**
 *  异步任务
 * @param task 执行的任务对象
 * @private
 */
Animation.prototype._asyncTask = function (task) {
    var me = this;
    //定义每一帧执行的回调函数
    var enterFrame = function (time) {
        var taskFn = task.taskFn;
        var next = function () {
            //停止当前任务
            me.timeline.stop();
            //执行下一个任务
            me._next();
        };
        taskFn(next, time);
    };
    this.timeline.onenterframe = enterFrame;
    this.timeline.start(this.interval);
};

/**
 *  切换到下一个任务
 * @private
 */
Animation.prototype._next = function () {
    this.index++;
    this._runTask();
};