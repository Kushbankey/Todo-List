const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const date=new Date();

//home active tab highlight
document.querySelectorAll(".nav-link").forEach((link) => {
    if (link.href === window.location.href) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
    }
});


if($(".title-h1").html()==="Today"){
    let day=date.getDate();
    let month=months[date.getMonth()];
    let year=date.getFullYear();
    $(".title-h1").text("Today : " + day + " " + month + " " + year);   
}

if(window.location.pathname==="/today"){
    $(".delete-btn").css("background-color", "#a683e3")
    $(".delete-btn").text("🌟");

    $(".delete-btn").click(function (event) {
        event.preventDefault(); // Prevent the default behavior of the button
    });
}