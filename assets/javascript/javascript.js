var firebaseConfig = {
    apiKey: "AIzaSyDWa8I4Hw761u_0dQv7UjgPUcOxUlqmkcs",
    authDomain: "trainactivity-4ff7d.firebaseapp.com",
    databaseURL: "https://trainactivity-4ff7d.firebaseio.com",
    projectId: "trainactivity-4ff7d",
    storageBucket: "",
    messagingSenderId: "223490108102",
    appId: "1:223490108102:web:83cb42bed08fc180"
  };
  firebase.initializeApp(firebaseConfig);

var database = firebase.database();

var currentTime = moment().format('LT');

$("#addTrain").on("click", function(event) {
    event.preventDefault();
    // Capture User Inputs and store them into variables
    var trainName = $("#trainNameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var firstTrainTime = $("#firstTrainTimeInput").val().trim();
    var frequency = $("#frequencyInput").val().trim();


    console.log(trainName,destination,firstTrainTime,frequency, currentTime);

    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency
    });

});



  database.ref().on("child_added", function (snapshot) {
    if(snapshot.val() != null){

        // returning the snapshot of the current row from firebase
        // current train is a complex structure that containes the values we stored in the database
        var currentTrain = snapshot.val();
        // created a moment object using the firstTrainTime in a 24/hour clock format
        var firstTrainMoment = moment(currentTrain.firstTrainTime, "HH:mm");
        // calling the Number() function on the frequency to return a numerical version of the frequency so we can use it to multiply
        var frequency = Number(currentTrain.frequency);
        // creating a clone() of our firstTrainMoment so we can use it to iterate through a forLoop without changing our original firstTrainTime
        var nextArrivaltime = firstTrainMoment.clone();

        //  using a forLoop to find the first nextArrivalTime in the future
        //  the isBefore() is used to find if a moment() object occurs before another
        //  we are checking to see if the nextArrivalTime occurs before our current time 
        //  moment() returns a moment object of the current time
        console.log("**************");
        for(var i = 1; nextArrivaltime.isBefore(moment()); i++){
            // our frequency is in "m" format
            // we are adding our frequency  times to the nextArrivalTime
            nextArrivaltime.add(frequency, "m")
        };

        var minutesAway = nextArrivaltime.fromNow();

        var row = $("<tr>");
        row.append("<td>" + snapshot.val().trainName + "</td>");
        row.append("<td>" + snapshot.val().destination + "</td>");
        row.append("<td>" + frequency + "</td>");
        row.append("<td>" + nextArrivaltime.format("h:mm a") + "</td>")
        row.append("<td>" + minutesAway + "</td>");
        $("tbody").append(row);
    console.log(snapshot.val().firstTrainTime);
    }
  }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
  });