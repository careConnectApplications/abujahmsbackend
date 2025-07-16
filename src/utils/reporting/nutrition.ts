import configuration from "../../config";
export const nutritionaggregatereports=(startdate:any,enddate:any)=>{

const nutritionaggregatechildren0to59thatreceivednutirtion = [
    {   
      
        $match:{createdAt:{ $gt: startdate, $lt: enddate } }

    },
     {
        $lookup: {
          from: "patientsmanagements",
          localField: "patient",
          foreignField: "_id",
          as: "patient",
        },
      },
      {
        $unwind: {
          path: "$patient",
          preserveNullAndEmptyArrays: true
        }
        
      },
    {
      $group: {
        _id: {
          ageinmonths: "$ageinmonths",
          typeofvisit: "$typeofvisit",
          gender: "$patient.gender"
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 } // Optional: sort descending by count
    },
    {
    $project:{
      parameters: "$_id",
      count: 1,
      _id: 0

    }
  }
  ];
  const nutritionaggregatechildren0to59growingwell =[
    {   
      
        $match:{$and:[{createdAt:{ $gt: startdate, $lt: enddate }},{growthaccordingtothechildhealthcard:configuration.growthaccordingtothechildhealthcard[0]} ]}
        //growthaccordingtothechildhealthcard

    },
     {
        $lookup: {
          from: "patientsmanagements",
          localField: "patient",
          foreignField: "_id",
          as: "patient",
        },
      },
      {
        $unwind: {
          path: "$patient",
          preserveNullAndEmptyArrays: true
        }
        
      },
    {
      $group: {
        _id: {
          gender: "$patient.gender"
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 } // Optional: sort descending by count
    },
    {
    $project:{
      parameters: "$_id",
      count: 1,
      _id: 0

    }
  }
  ];
  const nutritionaggregatechildren0to5exclusivebreadstfeeding =[
    {   
      
        $match:{$and:[{createdAt:{ $gt: startdate, $lt: enddate }},{infactandyoungchildfeeding:configuration.infactandyoungchildfeeding[0]},{ageinmonths:configuration.ageinmonths[0]} ]}
      

    },
     {
        $lookup: {
          from: "patientsmanagements",
          localField: "patient",
          foreignField: "_id",
          as: "patient",
        },
      },
      {
        $unwind: {
          path: "$patient",
          preserveNullAndEmptyArrays: true
        }
        
      },
    {
      $group: {
        _id: {
          gender: "$patient.gender"
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 } // Optional: sort descending by count
    },
    {
    $project:{
      parameters: "$_id",
      count: 1,
      _id: 0

    }
  }
  ];
  const nutritionaggregatechildren0to59givenvitaminasupplement=[
    {   
      
        $match:{$and:[{createdAt:{ $gt: startdate, $lt: enddate }} ]}
      

    },
     {
        $lookup: {
          from: "patientsmanagements",
          localField: "patient",
          foreignField: "_id",
          as: "patient",
        },
      },
      {
        $unwind: {
          path: "$patient",
          preserveNullAndEmptyArrays: true
        }
        
      },
    {
      $group: {
        _id: {
          gender: "$patient.gender",
          vitaminasupplement: "$vitaminasupplement"

        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 } // Optional: sort descending by count
    },
    {
    $project:{
      parameters: "$_id",
      count: 1,
      _id: 0

    }
  }
  ];
  const nutritionaggregatechildren12to59receiveddeworming = [
    {   
      
        $match:{$and:[{createdAt:{ $gt: startdate, $lt: enddate }},{  deworming: { $ne: null }} ]}
      

    },
     {
        $lookup: {
          from: "patientsmanagements",
          localField: "patient",
          foreignField: "_id",
          as: "patient",
        },
      },
      {
        $unwind: {
          path: "$patient",
          preserveNullAndEmptyArrays: true
        }
        
      },
    {
      $group: {
        _id: {
          gender: "$patient.gender"

        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 } // Optional: sort descending by count
    },
    {
    $project:{
      parameters: "$_id",
      count: 1,
      _id: 0

    }
  }
  ];
  return {nutritionaggregatechildren12to59receiveddeworming,nutritionaggregatechildren0to59givenvitaminasupplement,nutritionaggregatechildren0to5exclusivebreadstfeeding,nutritionaggregatechildren0to59growingwell,nutritionaggregatechildren0to59thatreceivednutirtion}
}
