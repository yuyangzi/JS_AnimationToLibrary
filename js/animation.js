/**
 * Created by 王宜明 on 2017/3/19.
 */
var elem = document.getElementById("animation");
var positions = ["0 -854","-174 -852","-349 -852","-524 -852","-698 -852","-873 -848"];
var imgURL = "img/rabbit-big.png";

animation(elem, positions, imgURL)
function animation(elem, positions, imgURL) {
    var index = 0;
    elem.style.backgroundImage = "url(" + imgURL + ")";
    elem.style.backgroundRepeat = "no-repeat";
    function run() {
        //获取positions数组中对应下标的值并用split方法将其分割成数组.
        var position = positions[index].split(" ");
        elem.style.backgroundPosition = position[0] + "px " + position[1] + "px";
        index++;
        if (index >= positions.length) {
            index = 0;
        }
    }
    setInterval(run,80);
}