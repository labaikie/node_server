'use strict'

function validate(string, type) {
  let regex

  switch(type) {

  case 'phone':
    regex = /\+[0-9]{0,14}$/
    break

  case 'email':
    regex = /(.+)@(.+){2,}\.(.+){2,}/
    break
  }

  if(!regex.test(string)) throw new Error(`Invalid format of ${type}`)
}

function randomize(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function findMatch(array, i) {
  return array.find(j => j._id == i)
}

function getUniqueArray(array, property = null) {
  return array.reduce((sum, current, i) => {
    if(sum.indexOf(current) < 0) {
      property ? sum.push(current[property]) : sum.push(current)
    }
    return sum
  }, [])
}

function deleteNulls(array) {
  return array.reduce((sum, current) => {
    if(current) sum.push(current)
    return sum
  }, [])
}

function getDate(option) {
  const todayStart = new Date(new Date().setHours(0,0,0,0))

  // if option exists, configure the date
  if (option) {

    // if new date calculation
    if(typeof(option) == 'number') {

      // returning new date
      const newDate = new Date(todayStart.setDate(todayStart.getDate() + option))
      return newDate

    // if string to date conversion
    } else {
      return new Date(option)
    }

  }

  // otherwise get the beginning of today
  return todayStart
}

module.exports = { validate, randomize, findMatch, getUniqueArray, deleteNulls, getDate }
