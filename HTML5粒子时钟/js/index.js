(function () {
    var stage, textStage, form, input;
    var circles, textPixels, textFormed;
    var offsetX, offsetY, text;
    var colors = ['#B2949D', '#FFF578', '#FF5F8D', '#37A9CC', '#188EB2'];

    function init() {
        initStages();
        //initForm();
        initText();
        initCircles();
        animate();
        //addListeners();
        
        setInterval(function () {
            var date = new Date();
            createText(date.pattern("hhmmss"));
        }, 1000)
    }

    Date.prototype.pattern = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份         
            "d+": this.getDate(), //日         
            "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时         
            "H+": this.getHours(), //小时         
            "m+": this.getMinutes(), //分         
            "s+": this.getSeconds(), //秒         
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度         
            "S": this.getMilliseconds() //毫秒         
        };
        var week = {
            "0": "/u65e5",
            "1": "/u4e00",
            "2": "/u4e8c",
            "3": "/u4e09",
            "4": "/u56db",
            "5": "/u4e94",
            "6": "/u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

    



    function getDate(date) {
        var str = ""
        //str += date.getFullYear()//年
        //str += date.getMonth() + 1//月 月比实际月份要少1
        //str += date.getDate()//日
        str += date.getHours()//HH
        str += date.getMinutes()//MM
        str += date.getSeconds(); //SS
        return str
    }

    // Init Canvas
    function initStages() {
        offsetX = (window.innerWidth - 600) / 2;
        offsetY = (window.innerHeight - 300) / 2;
        textStage = new createjs.Stage("text");
        textStage.canvas.width = 600;
        textStage.canvas.height = 200;

        stage = new createjs.Stage("stage");
        stage.canvas.width = window.innerWidth;
        stage.canvas.height = window.innerHeight;
    }

//  function initForm() {
//      form = document.getElementById('form');
//      form.style.top = offsetY + 200 + 'px';
//      form.style.left = offsetX + 'px';
//      input = document.getElementById('inputText');
//  }

    function initText() {
        text = new createjs.Text("t", "80px 'Source Sans Pro'", "#eee");
        text.textAlign = 'center';
        text.x = 300;
    }

    function initCircles() {
        circles = [];
        for (var i = 0; i < 600; i++) {
            var circle = new createjs.Shape();
            var r = 7;
            var x = window.innerWidth * Math.random();
            var y = window.innerHeight * Math.random();
            var color = colors[Math.floor(i % colors.length)];
            var alpha = 0.2 + Math.random() * 0.5;
            circle.alpha = alpha;
            circle.radius = r;
            circle.graphics.beginFill(color).drawCircle(0, 0, r);
            circle.x = x;
            circle.y = y;
            circles.push(circle);
            stage.addChild(circle);
            circle.movement = 'float';
            tweenCircle(circle);
        }
    }


    // animating circles
    function animate() {
        stage.update();
        requestAnimationFrame(animate);
    }

    function tweenCircle(c, dir) {
        if (c.tween) c.tween.kill();
        if (dir == 'in') {
            c.tween = TweenLite.to(c, 0.4, {
                x: c.originX,
                y: c.originY,
                ease: Quad.easeInOut,
                alpha: 1,
                radius: 5,
                scaleX: 0.4,
                scaleY: 0.4,
                onComplete: function () {
                    c.movement = 'jiggle';
                    tweenCircle(c);
                }
            });
        } else if (dir == 'out') {
            c.tween = TweenLite.to(c, 0.8, {
                x: window.innerWidth * Math.random(),
                y: window.innerHeight * Math.random(),
                ease: Quad.easeInOut,
                alpha: 0.2 + Math.random() * 0.5,
                scaleX: 1,
                scaleY: 1,
                onComplete: function () {
                    c.movement = 'float';
                    tweenCircle(c);
                }
            });
        } else {
            if (c.movement == 'float') {
                c.tween = TweenLite.to(c, 5 + Math.random() * 3.5, {
                    x: c.x + -100 + Math.random() * 200,
                    y: c.y + -100 + Math.random() * 200,
                    ease: Quad.easeInOut,
                    alpha: 0.2 + Math.random() * 0.5,
                    onComplete: function () {
                        tweenCircle(c);
                    }
                });
            } else {
                c.tween = TweenLite.to(c, 0.05, {
                    x: c.originX + Math.random() * 3,
                    y: c.originY + Math.random() * 3,
                    ease: Quad.easeInOut,
                    onComplete: function () {
                        tweenCircle(c);
                    }
                });
            }
        }
    }

    function formText() {
        for (var i = 0, l = textPixels.length; i < l; i++) {
            circles[i].originX = offsetX + textPixels[i].x;
            circles[i].originY = offsetY + textPixels[i].y;
            tweenCircle(circles[i], 'in');
        }
        textFormed = true;
        if (textPixels.length < circles.length) {
            for (var j = textPixels.length; j < circles.length; j++) {
                circles[j].tween = TweenLite.to(circles[j], 0.4, {
                    alpha: 0.1
                });
            }
        }
    }

    function explode() {
        for (var i = 0, l = textPixels.length; i < l; i++) {
            tweenCircle(circles[i], 'out');
        }
        if (textPixels.length < circles.length) {
            for (var j = textPixels.length; j < circles.length; j++) {
                circles[j].tween = TweenLite.to(circles[j], 0.4, {
                    alpha: 1
                });
            }
        }
    }

    // event handlers
    // function addListeners() {
    //     form.addEventListener('submit', function(e) {
    //         e.preventDefault();
    //         if(textFormed) {
    //             explode();
    //             if(input.value != '') {
    //                 setTimeout(function() {
    //                     createText(input.value.toUpperCase());
    //                 }, 810);
    //             } else {
    //                 textFormed = false;
    //             }
    //         } else {
    //             createText(input.value.toUpperCase());
    //         }

    //     });
    // }

    function createText(t) {
        var fontSize = 860 / (t.length);
        if (fontSize > 160) fontSize = 160;
        text.text = t;
        text.font = "900 " + fontSize + "px 'Source Sans Pro'";
        text.textAlign = 'center';
        text.x = 300;
        text.y = (172 - fontSize) / 2;
        textStage.addChild(text);
        textStage.update();

        var ctx = document.getElementById('text').getContext('2d');
        var pix = ctx.getImageData(0, 0, 600, 200).data;
        textPixels = [];
        for (var i = pix.length; i >= 0; i -= 4) {
            if (pix[i] != 0) {
                var x = (i / 4) % 600;
                var y = Math.floor(Math.floor(i / 600) / 4);

                if ((x && x % 8 == 0) && (y && y % 8 == 0)) textPixels.push({
                    x: x,
                    y: y
                });
            }
        }

        formText();

    }


    window.onload = function () {
        init()
    };
})();