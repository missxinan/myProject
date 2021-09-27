export default function Time(Time) {
    var time = new Date(Time);
    var hour = time.getHours() < 10 ? '0' + time.getHours() : '' + time.getHours(); //时
    var min = time.getMinutes() < 10 ? '0' + time.getMinutes() : '' + time.getMinutes(); //分
    var sec = time.getSeconds() < 10 ? '0' + time.getSeconds() : '' + time.getSeconds(); //秒
    var birthday = time.getFullYear() + "-" + ((time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : '' + (time.getMonth() + 1)) + "-" + time.getDate() + " " + hour + ":" + min + ":" + sec;
    return birthday
}