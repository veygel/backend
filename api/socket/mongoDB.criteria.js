const dbService = require("../../services/db.service");
const ObjectId = require("mongodb").ObjectId;

module.exports = {
  buildCriteria,
  getTopRated
};

async function buildCriteria(filterBy) {
  const criteria = {};

  if (filterBy.topRated) {
    var filteredIds = await _getFilteredIdsFromSocials(filterBy);
  }

  if (filterBy.name) {
    var regex = new RegExp(filterBy.name, "i");
    criteria.$or = [
      { firstName: { $regex: regex } },
      { lastName: { $regex: regex } }
    ];
  }

  if (filterBy.gender && filterBy.gender !== "All") {
    criteria.gender = filterBy.gender;
  }

  if (filterBy.age && Array.isArray(filterBy.age)) {
    var minDob = _getDobFromAge(filterBy.age[0]);
    var maxDob = _getDobFromAge(filterBy.age[1]);
    criteria.$and = [
      { dateOfBirth: { $lte: minDob } },
      { dateOfBirth: { $gte: maxDob } }
    ];
  }

  if (filterBy.price && Array.isArray(filterBy.price)) {
    var min = +filterBy.price[0];
    var max = +filterBy.price[1];
    criteria.$and = [
      { pricePerPost: { $gte: min } },
      { pricePerPost: { $lte: max } }
    ];
  }

  if (filterBy.tags && Array.isArray(filterBy.tags)) {
    criteria.tags = { $all: filterBy.tags };
  } else if (filterBy.tags) {
    criteria.tags = filterBy.tags;
  }

  /* Aggregation to filter only by the chosen social medias */
  if (filterBy.socials) {
    var filteredIds = await _getFilteredIdsFromSocials(filterBy);
    var objectsIds = filteredIds.map(id => {
      return ObjectId(id._id);
    });
    criteria._id = { $in: objectsIds };
  }

  return criteria;
}

async function _getFilteredIdsFromSocials(filterBy) {
  var socials = filterBy.socials;
  let matchByType = null;

  if (socials.types && Array.isArray(socials.types)) {
    matchByType = { "socials.type": { $all: socials.types } };
  } else if (socials.types) {
    matchByType = { "socials.type": socials.types };
  } else {
    matchByType = { "socials.type": { $exists: true } };
  }
  var matchBy = _getMatchBy(filterBy);

  const collection = await dbService.getCollection("influencer");
  var socialId = await collection
    .aggregate([
      {
        $match: matchByType
      },
      {
        $unwind: "$socials"
      },
      {
        $set: {
          "socials.totalFollowersCount": {
            $add: ["$socials.menFollowers", "$socials.womenFollowers"]
          }
        }
      },
      {
        $set: {
          "socials.menFollowersPercentage": {
            $sum: {
              $multiply: [
                100,
                {
                  $divide: [
                    "$socials.menFollowers",
                    "$socials.totalFollowersCount"
                  ]
                }
              ]
            }
          }
        }
      },
      {
        $match: matchBy
      },
      {
        $group: { 
            _id: "$_id",
        }
      }
    ])
    .toArray();
    console.log('SOCIALS IDDDSSSSS', socialId);
    
  return socialId;
}

function _getMatchBy(filterBy) {
  var socials = filterBy.socials;
  var matchBy = {};
  if (socials.followersCount) {
    let minFollowers = +socials.followersCount[0];
    let maxFollowers = +socials.followersCount[1];
    matchBy["socials.totalFollowersCount"] = {
      $gte: minFollowers,
      $lte: maxFollowers
    };
  }
  if (socials.menFollowersPercentage) {
    matchBy["socials.menFollowersPercentage"] = {
      $gte: +socials.menFollowersPercentage
    };
  }
  if (socials.posts) {
    matchBy["socials.posts"] = {
      $gte: +socials.posts
    };
  }
  if (socials.stories) {
    matchBy["socials.stories"] = {
      $gte: +socials.stories
    };
  }
  if (socials.followersAvgAge) {
    let minAge = +socials.followersAvgAge[0];
    let maxAge = +socials.followersAvgAge[1];
    matchBy["socials.followersAvgAge"] = {
      $gte: minAge,
      $lte: maxAge
    };
  }
  return matchBy;
}

function _getDobFromAge(age) {
  var yearInSec = 31557600;
  var ageInSec = age * yearInSec;
  var todayInSec = Date.now() / 1000;
  return todayInSec - ageInSec;
}


async function getTopRated(filterBy){
    var topRated = {};
    const collection = await dbService.getCollection("influencer");
    var socialId = await collection
      .aggregate([
          {
              $unwind: "$socials"
          },
          {
            $set: {
              "socials.totalFollowersCount": {
                $add: ["$socials.menFollowers", "$socials.womenFollowers"]
              }
            }
          },
          {
            $group: { 
                _id: "$_id",
                maxFollowers: {"$max": "socials.menFollowersPercentage"}
            }
          },
          {
              $sort: {"maxFollowers":1}
          }
      ])
      .toArray();

    var objectsIds = socialId.map(id => {
        return ObjectId(id._id);
      });
      topRated._id = { $in: objectsIds };
  
    return topRated;
}