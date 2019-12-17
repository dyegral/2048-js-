$(function () {
    var arr = [];

    init();

    /**
     * 初始化数组
     */
    function init() {
        var n = 0;//数组位置计数用
        //随机两个对象firstRan，secondRan 用来记录第一次出现的两个随机数2或4，以及出现的位置
        var firstRan = {};
        firstRan.loc = ran(16);
        firstRan.num = ran(2) === 0 ? 2 : 4;

        var secondRan = {};
        while (true) {
            secondRan.loc = ran(16);
            if (secondRan.loc !== firstRan.loc) {
                secondRan.num = ran(2) === 0 ? 2 : 4;
                break;
            }
        }

        for (let i = 0; i < 4; i++) {
            arr[i] = [];
            for (let j = 0; j < 4; j++) {
                if (n === firstRan.loc) {
                    arr[i][j] = firstRan.num;
                    createItem(i, j, firstRan.num);
                } else if (n === secondRan.loc) {
                    arr[i][j] = secondRan.num;
                    createItem(i, j, secondRan.num);
                } else {
                    arr[i][j] = 0;
                }
                n++;
            }
        }
    }

    /**
     * 生成一个0~n之间的随机数
     */
    function ran(n) {
        return Math.floor(Math.random() * n);
    }

    /**
     * 生成一个有数字的item
     * i,j 放置的位置，value 放入的值
     */
    function createItem(i, j, value) {
        var item = `<div class="num-item item-${i}${j}"><span>${value}</span></div>`;
        $(".game-view:first").append(item);
    }

    /**
     * 随机空白位置生成随机2或4
     */
    function createRanItem() {
        var blanks = 0, n = 0;

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (arr[i][j] === 0) {
                    blanks++;
                }
            }
        }

        var loc = ran(blanks);

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (arr[i][j] === 0) {
                    if (loc === n) {
                        var value = ran(2) === 0 ? 2 : 4;
                        var item = `<div class="num-item item-${i}${j}"><span>${value}</span></div>`;
                        $(".game-view:first").append(item);
                        arr[i][j] = value;
                        return;
                    }
                    n++;
                }
            }
        }
    }

    /**
     * 移动有数字的item
     * 从（i1,j1）移动到 （i2,j2）
     */
    function moveItem(i1, j1, i2, j2) {
        $(`.item-${i1}${j1}`).removeClass(`item-${i1}${j1}`).addClass(`item-${i2}${j2}`);

        arr[i2][j2] = arr[i1][j1];
        arr[i1][j1] = 0;
    }

    /**
     * i1,j1（i2,j2）合并到 （i2,j2）
     */
    function mergeItem(i1, j1, i2, j2) {
        $(`.item-${i2}${j2}`).remove();
        $(`.item-${i1}${j1}`).removeClass(`item-${i1}${j1}`).addClass(`item-${i2}${j2}`);

        arr[i2][j2] *= 2;
        arr[i1][j1] = 0;
    }

    /**
     * 修改span的值为正确的值
     */
    function displayNum() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (arr[i][j] !== 0) {
                    $(`.item-${i}${j}`).children('span').text(arr[i][j]);
                }
            }
        }
    }

    /**
     * 向上移动
     */
    function moveUp() {
        var flag = false;//标志数组是否变动

        for (let j = 0; j < 4; j++) {
            for (let i = 1; i < 4; i++) {
                if (arr[i][j] === 0) {
                    continue;
                }
                var k = i - 1;
                while (k >= 0) {
                    if (arr[k][j] !== 0) {
                        break;
                    }
                    k--;
                }
                if (k === -1) {
                    //未找到不为0的数
                    //arr[i][j]移动到最上面
                    moveItem(i, j, 0, j);
                    flag = true;
                } else if (arr[k][j] !== 0) {
                    //找到不为0的数
                    if (arr[i][j] === arr[k][j]) {
                        //两个数相等 合并
                        mergeItem(i, j, k, j);
                        flag = true;
                    } else if (i !== k + 1) {
                        //移动到k下面一位
                        moveItem(i, j, (k + 1), j);
                        flag = true;
                    }
                }
            }
        }
        if (flag) {
            createRanItem();
        } else {
            console.log('不能移动')
        }
    }

    /**
    * 向下移动
    */
    function moveDown() {
        var flag = false;//标志数组是否变动
        for (let j = 0; j < 4; j++) {
            for (let i = 2; i >= 0; i--) {
                if (arr[i][j] === 0) {
                    continue;
                }
                var k = i + 1;
                while (k < 4) {
                    if (arr[k][j] !== 0) {
                        break;
                    }
                    k++;
                }
                if (k === 4) {
                    //未找到不为0的数
                    //arr[i][j]移动到最下面
                    moveItem(i, j, 3, j);
                    flag = true;
                } else if (arr[k][j] !== 0) {
                    //找到不为0的数
                    if (arr[i][j] === arr[k][j]) {
                        //两个数相等 合并
                        mergeItem(i, j, k, j);
                        flag = true;
                    } else if (i !== k - 1) {
                        //移动到k上面一位
                        moveItem(i, j, (k - 1), j);
                        flag = true;
                    }
                }
            }
        }
        if (flag) {
            createRanItem();
        } else {
            console.log('不能移动')
        }
    }

    /**
     * 向左移动
     */
    function moveLeft() {
        var flag = false;

        for (let i = 0; i < 4; i++) {
            for (let j = 1; j < 4; j++) {
                if (arr[i][j] === 0) {
                    continue;
                }
                var k = j - 1;
                while (k >= 0) {
                    if (arr[i][k] !== 0) {
                        break;
                    }
                    k--;
                }
                if (k === -1) {
                    //未找到不为0的数
                    //arr[i][j]移动到第一个
                    moveItem(i, j, i, 0);
                    flag = true;
                } else if (arr[i][k] !== 0) {
                    //找到不为0的数
                    if (arr[i][j] === arr[i][k]) {
                        //两个数相等 合并
                        mergeItem(i, j, i, k);
                        flag = true;
                    } else if (j !== k + 1) {
                        //移动到k下面一位
                        moveItem(i, j, i, k + 1);
                        flag = true;
                    }
                }
            }
        }
        if (flag) {
            createRanItem();
        } else {
            console.log('不能移动')
        }
    }

    /**
    * 向右移动
    */
    function moveRight() {
        var flag = false;//标志数组是否变动
        for (let i = 0; i < 4; i++) {
            for (let j = 2; j >= 0; j--) {
                if (arr[i][j] === 0) {
                    continue;
                }
                var k = j + 1;
                while (k < 4) {
                    if (arr[i][k] !== 0) {
                        break;
                    }
                    k++;
                }
                if (k === 4) {
                    //未找到不为0的数
                    //arr[i][j]移动到最右边
                    moveItem(i, j, i, 3);
                    flag = true;
                } else if (arr[i][k] !== 0) {
                    //找到不为0的数
                    if (arr[i][j] === arr[i][k]) {
                        //两个数相等 合并
                        mergeItem(i, j, i, k);
                        flag = true;
                    } else if (j !== k - 1) {
                        //移动到k左边一位
                        moveItem(i, j, i, k - 1);
                        flag = true;
                    }
                }
            }
        }
        if (flag) {
            createRanItem();
        } else {
            console.log('不能移动')
        }
    }

    /**
     * 判断游戏结束
     */
    function isGameOver() {

        if (arr[0][0] === 0) {
            return false;
        }

        for (let i = 0; i < 4; i++) {
            for (let j = 1; j < 4; j++) {
                if ((arr[i][j] === 0) || (arr[i][j] === arr[i][j - 1]) || (arr[j][i] === 0) || (arr[j][i] === arr[j - 1][i])) {
                    return false;
                }
            }
        }

        return true;
    }

    document.onkeyup = function (e) {
        switch (e.keyCode) {
            case 38:
                moveUp();
                break;
            case 37:
                moveLeft();
                break;
            case 39:
                moveRight();
                break;
            case 40:
                moveDown();
                break;
            default:
                break;
        }
        displayNum();
        if (isGameOver()) {
            alert('游戏结束！');
            arr = [];
            $('.num-item').remove();
            init();
        }
    }

    //下面都是移动端手势滑动方向识别
    var startx, starty;
    //获得角度
    function getAngle(angx, angy) {
        return Math.atan2(angy, angx) * 180 / Math.PI;
    };

    //根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
    function getDirection(startx, starty, endx, endy) {
        var angx = endx - startx;
        var angy = endy - starty;
        var result = 0;

        //如果滑动距离太短
        if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
            return result;
        }

        var angle = getAngle(angx, angy);
        if (angle >= -135 && angle <= -45) {
            result = 1;
        } else if (angle > 45 && angle < 135) {
            result = 2;
        } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
            result = 3;
        } else if (angle >= -45 && angle <= 45) {
            result = 4;
        }

        return result;
    }
    //手指接触屏幕
    document.addEventListener("touchstart", function (e) {
        startx = e.touches[0].pageX;
        starty = e.touches[0].pageY;
    }, false);
    //手指离开屏幕
    document.addEventListener("touchend", function (e) {
        var endx, endy;
        endx = e.changedTouches[0].pageX;
        endy = e.changedTouches[0].pageY;
        var direction = getDirection(startx, starty, endx, endy);
        switch (direction) {
            case 0:
                alert("未滑动！");
                break;
            case 1:
                moveUp();
                break;
            case 2:
                moveDown();
                break;
            case 3:
                moveLeft();
                break;
            case 4:
                moveRight();
                break;
            default:
        }
        displayNum();
        if (isGameOver()) {
            alert('游戏结束！');
            arr = [];
            $('.num-item').remove();
            init();
        }
    }, false);
})