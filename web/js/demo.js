(function() {
  $(function() {
    var sourcecodeDisplay;
    sourcecodeDisplay = $('#sourcecode-display');
    if (sourcecodeDisplay.length) {
      sourcecodeDisplay.empty().append($('<code />').append($('<pre />').html($('#sourcecode').html().replace(/\n\t\t\t/gm, '\n').replace('>', '&gt;').replace('<', '&lt;'))));
      return $('#css-display').empty().append($('<code />').append($('<pre />').html($('#page-css').html().replace(/\n\t\t\t/gm, '\n'))));
    }
  });

}).call(this);
