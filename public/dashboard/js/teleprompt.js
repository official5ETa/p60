const _telepromptName = $('#telepromptName');
const _telepromptIndex = $('#telepromptIndex');
const _telepromptIndexMax = $('#telepromptIndexMax');
const _telepromptButtonPrev = $('#telepromptButtonPrev');
const _telepromptButtonNext = $('#telepromptButtonNext');
const _telepromptTextNext = $('#telepromptTextNext');
const _telepromptTextCurr = $('#telepromptTextCurr');
const _telepromptTextHidden = $('#telepromptTextHidden');
const _telepromptTextPrev = $('#telepromptTextPrev');
const _telepromptClearToggle = $('#telepromptClearToggle');

let telepromptMedia,
  telepromptIndex,
  telepromptClear = false;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function loadTeleprompt(media) {
  telepromptMedia = media;

  if (telepromptMedia) {
    telepromptIndex = 0;
    _telepromptName.html(
      telepromptMedia.name.replace(/\.teleprompt\.txt$/, ''),
    );
    _telepromptIndex
      .prop('disabled', false)
      .attr('max', telepromptMedia.content.length + 1)
      .val(telepromptIndex);
    _telepromptIndexMax
      .addClass('btn-secondary')
      .removeClass('btn-outline-secondary')
      .text(telepromptMedia.content.length)
      .prop('disabled', false);
    _telepromptClearToggle.bootstrapToggle('enable');
    telepromptClearToggleChange();
    loadTelepromptIndex();
  } else {
    telepromptIndex = undefined;
    _telepromptName.html(
      '<span class="text-muted">kein Teleprompt gewählt</span>',
    );
    _telepromptIndex.prop('disabled', true).attr('max', null).val(null);
    _telepromptIndexMax
      .addClass('btn-outline-secondary')
      .removeClass('btn-secondary')
      .text('-')
      .prop('disabled', true);
    _telepromptClearToggle.bootstrapToggle('disable').bootstrapToggle('off');
    telepromptClearToggleChange();
  }
  setTelepromptControlsEnabled();
}

function setTelepromptControlsEnabled() {
  _telepromptButtonPrev.prop(
    'disabled',
    !telepromptMedia || telepromptIndex <= 0,
  );
  _telepromptButtonNext.prop(
    'disabled',
    !telepromptMedia || telepromptIndex >= telepromptMedia.content.length + 1,
  );
}

function loadTelepromptIndex(index = telepromptIndex) {
  telepromptIndex = index;
  setTelepromptControlsEnabled();
  _telepromptIndex.val(telepromptIndex);

  _telepromptTextPrev.text(
    telepromptIndex < 2 || telepromptIndex === undefined
      ? ''
      : telepromptMedia.content[telepromptIndex - 2] || '',
  );
  _telepromptTextCurr.text(
    telepromptIndex < 1 || telepromptIndex === undefined
      ? ''
      : telepromptMedia.content[telepromptIndex - 1] || '',
  );
  _telepromptTextNext.text(
    telepromptIndex === undefined
      ? ''
      : telepromptMedia.content[telepromptIndex - 0] || '',
  );

  telepromptSocketSendText(
    telepromptClear || telepromptIndex < 1 || telepromptIndex === undefined
      ? ''
      : telepromptMedia.content[telepromptIndex - 1] || '',
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function telepromptPrev() {
  if (telepromptIndex > 0) {
    telepromptIndex--;
    loadTelepromptIndex();
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function telepromptNext() {
  if (telepromptIndex <= telepromptMedia.content.length) {
    telepromptIndex++;
    loadTelepromptIndex();
  }
}

function telepromptClearToggleChange() {
  telepromptClear = _telepromptClearToggle.is(':checked');
  loadTelepromptIndex();
  _telepromptTextHidden.css('opacity', telepromptClear ? '' : 0);
}

_telepromptClearToggle.change(telepromptClearToggleChange);

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      telepromptPrev();
      event.preventDefault();
      break;
    case 'ArrowDown':
      telepromptNext();
      event.preventDefault();
      break;
    case 'c':
    case 'C':
      _telepromptClearToggle.bootstrapToggle('toggle');
      break;
  }
});

loadTeleprompt();
