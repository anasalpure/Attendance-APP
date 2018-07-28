
$(function() {
    "use strict";


/*************************
* define the Model
**************************/
    var Model = {
        daysNumber : 0 ,

        init : (daysnum =11)=>{
            Model.daysNumber =daysnum;

            if (!localStorage.attendance) {
                console.log('Creating attendance records...');
                function getRandom() {
                    return (Math.random() >= 0.5);
                }

                    //create attendance object
                    let attendance = {};

                    Model.students.forEach(function(student) {
                        //evry srudent has array represent  attendance days
                        attendance[student] = [];

                        for (var i = 0; i <= Model.daysNumber ; i++) {
                            attendance[student].push(getRandom());  //true or false
                        }
                    });
                //store attendance
                Model.store(attendance);
            }

        } ,

        students : [
            "Slappy the Frog",
            "Lilly the Lizard",
            "Paulrus the Walrus",
            "Gregory the Goat",
            "Adam the Anaconda",
        ],

        store: (attendance)=> {
            localStorage.attendance = JSON.stringify(attendance);
        }



    }

/*************************
* define the Controler
**************************/
    var Controler = {
       cash :null,

       init : ()=>{
            Model.init();
            View.init();
       },

       getDate : ()=> {
            if(Controler.cash) return Controler.cash;
            return Controler.countMissing();
           
       },

       
    // Count a student's missed days
     countMissing : ()=> {
        let students_days = JSON.parse(localStorage.attendance);
        for(let student in students_days) { 
            let days = students_days[student] ;
            let MissingDays=0
            days.forEach( (day)=> {
               if(!day) MissingDays++ ;
            } );

            days.push(MissingDays);
        }

        Controler.cash = students_days;
        return students_days;
    },

    update : (studentName , day ,checked)=> {
        let attendance = JSON.parse(localStorage.attendance);
        attendance[studentName][day] = checked ;
        Model.store(attendance);
    }


    }


/*************************
* define the View
**************************/
    var View = {
        // get data from controler getDate() and render it on screen.
        init : ()=> {
           
           View.render(Controler.getDate());

           //listen to changes and restore on storage
           let allCheckboxes = $('tbody input');
           // When a checkbox is clicked, update localStorage
           allCheckboxes.on('click', (event)=> {
              let targetID =event.target.id;
              let checked = event.target.checked;
              let studentName =targetID.split('-')[0];
              let day =targetID.split('-')[1];

              console.log(studentName , day ,checked );
              Controler.update(studentName , day ,checked);     
           });


        },

        render : (data)=> {
             //render the first row in header $('table thead').append( "<tr>" )
            let headerRow = $( '<tr> </tr>' );
            headerRow.append ( $('<th class="name-col">Student Name</th>' ) );
            for(let i=1 ; i<=Model.daysNumber ;i++){
                headerRow.append( `<th>${i}</th>` ); 
            }
            headerRow.append( '<th class="missed-col">Days Missed-col</th>' ); 

            $('table thead').append(headerRow) ;


            //render the students data tabel bode  $('table tbody').append( "<tr>" )
            for(let studenName in data) { 
                let bodyRows = $( '<tr class="student" > </tr>' );
                bodyRows.append ( $(`<td class="name-col">${ studenName }</td>`) );
                let days= data[studenName];
                //last valye of days is sum of missed days
                for(let index=0 ;index<days.length-1 ; index++){
                    bodyRows.append ( $(' <td class="attend-col"> </td>') 
                                   .append ( `<input id="${studenName+'-'+index }" type="checkbox" ${days[index] ?'checked' : '' } >`)
                    );
                }    
                bodyRows.append ( $(`<td class="missed-col">${days[days.length-1]}</td>`) );
                $('table tbody').append( bodyRows );
            }

           

            




        },


    }

//start app
Controler.init();

});
