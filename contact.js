

function addLocation(event){
      var taskinput = document.getElementById("input2");
      task = taskinput.value.trim();
      if(task!=" "){
          document.querySelector(".task-box").classList.add("move-left");
          document.querySelector(".empty-box").classList.add("move-right");
          var taskList = document.getElementById("taskbox");
          var newTask = document.createElement("li");
          newTask.textContent = task;
          taskList.appendChild(newTask);
          currentTask = newTask;
          taskinput.value = " ";

      }
}



function showNearestLocation() {
    const center = { lat: -34.397, lng: 150.644 };
    const map = new google.maps.Map(document.getElementById('emptybox'), {
        zoom: 12, 
        center: center 
    });
    
    const marker = new google.maps.Marker({
        position: center,
        map: map
    });
}


 
  
  



function deleteTask(){
         var taskList  = document.getElementById("taskbox");
         var lastTaskindex = taskList.children.length-1;
         if(lastTaskindex>=0){
               taskList.removeChild(taskList.children[lastTaskindex]);
         }

         if(taskList.children.length==0){
              document.querySelector(".task-box").classList.remove("move-left");
              document.querySelector(".empty-box").classList.remove("move-right");
               
         }
}



