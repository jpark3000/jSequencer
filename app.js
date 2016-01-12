var myAudioContext = new AudioContext();
var colSelected = 0;
var timeoutId = 0;
var filter = myAudioContext.createBiquadFilter();
var filterDetune = -3000;
var filterQ = 200;

function playNote(freq) {
  var oscillator = myAudioContext.createOscillator();

  oscillator.connect(filter);
  filter.connect(myAudioContext.destination);

  oscillator.type = 'sawtooth';
  oscillator.frequency.value = freq;
  filter.type = 'lowpass';

  filter.frequency.value = 500;

  filter.Q.value = filterQ;
  filter.detune.value = filterDetune;

  oscillator.start(0);
  setTimeout(function() {
    oscillator.stop(0);
  }, 100);
}


function run() {
  var current = colSelected += 1;
  var previous = colSelected - 1;
  if (previous <= 0) previous = 16;

  var $step = $('tr td:nth-child('+current+')');
  var prevStep = $('tr td:nth-child('+previous+')');

  $step.addClass('selected');
  prevStep.removeClass('selected');

  $.each($step, function(index, value) {
    if ($($step[index]).attr('class') == 'play selected') {
      var freq = $($step[index]).parent().data('freq');
      playNote(freq);
    }

  });

  timeoutId = setTimeout(run, 200);
  if (colSelected >= 16) colSelected = 0;
}

function enableStep() {
  $('tr').click(function(e) {
    $(e.target).toggleClass('play');
  });
}

function tracking() {
  var canvas = document.getElementById("xycontroller");
  var ctx = canvas.getContext('2d');

  $(canvas).mousemove(function(e) {
    var x = -3000;
    x += (e.pageX) * 16;
    filterDetune = x;

    var y = 1;
    y += (e.pageY - this.offsetTop) / 1;
    filterQ = y;
  });

  $(canvas).mouseleave(function() {
    filterDetune = -3000;
    filterQ = 1;
  });
}


$(document).ready(function() {
  enableStep();
  tracking();
  $('#play').on('click', run);
  $('#pause').on('click', function() {
    clearTimeout(timeoutId);
  });
});
