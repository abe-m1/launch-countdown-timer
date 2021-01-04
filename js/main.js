// modified from https://codepen.io/shshaw/pen/vKzoLL?editors=1111
// written with classes instead of constructor functions
class CountdownTracker {
  constructor(label, value) {
    this.label = label;
    this.value = value;
    this.card = document.createElement('div');
    this.card.className = 'flip-clock__piece';
    this.card.innerHTML = `<div class="flip-clock__card card"><div class="card__top"></div><div class="card__bottom"></div><div class="card__back"><div class="card__bottom"></div></div></div>
      <span class="flip-clock__slot">${label}</span>`;
    this.cardTop = this.card.querySelector('.card__top');
    this.cardBottom = this.card.querySelector('.card__bottom');
    this.cardBack = this.card.querySelector('.card__back');
    this.cardBackBottom = this.card.querySelector('.card__back .card__bottom');
  }
  //create an individual card composed of 4 sections

  //access each of the 4 card components

  update(val) {
    val = ('0' + val).slice(-2);
    if (val !== this.currentValue) {
      if (this.currentValue >= 0) {
        //when card is flipping the bottom value of the card, and
        // the back of the top portion of the card will have the same value
        this.cardBack.setAttribute('data-value', this.currentValue);
        this.cardBottom.setAttribute('data-value', this.currentValue);
      }
      this.currentValue = val;
      this.cardTop.innerText = this.currentValue;
      this.cardBackBottom.setAttribute('data-value', this.currentValue);

      this.card.classList.remove('flip');
      // TO-DO what is void doing?
      void this.card.offsetWidth;
      this.card.classList.add('flip');
    }
  }
}

// Calculation adapted from https://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/

function getTimeRemaining(endtime) {
  const t = Date.parse(endtime) - Date.parse(new Date());
  return {
    Total: t,
    Days: Math.floor(t / (1000 * 60 * 60 * 24)),
    Hours: Math.floor((t / (1000 * 60 * 60)) % 24),
    Minutes: Math.floor((t / 1000 / 60) % 60),
    Seconds: Math.floor((t / 1000) % 60),
  };
}

//returns default 12 hour timer
function getTime() {
  const t = new Date();
  return {
    Total: t,
    Hours: t.getHours() % 12,
    Minutes: t.getMinutes(),
    Seconds: t.getSeconds(),
  };
}

class Clock {
  constructor(countdown, callback) {
    this.countdown = countdown ? new Date(Date.parse(countdown)) : false;
    this.callback = callback || function () {};
    this.updateFn = countdown ? getTimeRemaining : getTime;
    this.card = document.createElement('div');
    this.card.className = 'flip-clock';
  }
  // if countdown parameter passed in create new date

  // if no callback function passed in, assign value empty function

  // if countdown value exists return object with time values
  // else return object with time values for 12 hours

  //create container for cards

  start() {
    let trackers = {};
    let t = this.updateFn(this.countdown);
    let key;
    let timeinterval;

    //t should have values of Total, Days, Hours, Minutes, Seconds
    for (key in t) {
      if (key === 'Total') {
        // if 'Total' skip
        continue;
      }

      //assign each key in the object returned from updateFn to
      // the trackers object

      //pass in the key and the value
      trackers[key] = new CountdownTracker(key, t[key]);

      //append the card propery from CountdownTracker to the cardContainer
      this.card.appendChild(trackers[key].card);
    }

    let i = 0;
    const updateClock = () => {
      timeinterval = requestAnimationFrame(updateClock);

      // throttle so it's not constantly updating the time.
      // only return value from modulo operation of 1 will be true
      if (i++ % 10) {
        return;
      }

      // if timer has ended
      const t = this.updateFn(this.countdown);

      if (t.Total < 0) {
        cancelAnimationFrame(timeinterval);
        for (key in trackers) {
          trackers[key].update(0);
        }
        callback();
        return;
      }
      //else if there is still time remaining update value
      for (key in trackers) {
        trackers[key].update(t[key]);
      }
    };

    setTimeout(updateClock, 500);
    return this.card;
  }
}

const deadline = new Date(Date.parse(new Date()) + 12 * 24 * 60 * 60 * 1000);
const c = new Clock(deadline, function () {
  alert('countdown complete');
});
c.start();
const clockContainer = document.querySelector('.clock-container');
clockContainer.appendChild(c.card);
