const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const date=new Date();

//home active tab highlight
document.querySelectorAll(".nav-link").forEach((link) => {
    if (link.href === window.location.href) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
    }
});

let day=date.getDate();
let month=months[date.getMonth()];
let year=date.getFullYear();

$("#date").text(day + " " + month + " " + year);

var checkBoxes=$("input[type='checkbox']");
var taskCount=$("#taskCount");
const totalTasks=checkBoxes.length;
var count=totalTasks;

for(var i=0;i<count;i++){
    checkBoxes[i].addEventListener('change',function(){
        if(this.checked){
            count--;
        }
        else{
            count++;
        }

        if(count===0){
            taskCount.text("Hooray! You completed all of your tasks!");
        }
        else{
            taskCount.text("Number of tasks left: " + count + "/" + totalTasks);
        }
    });
}