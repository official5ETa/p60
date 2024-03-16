const _mediaTableIndicCount = $('#mediaTableIndicCount');
const _mediaTableIndicHidden = $('#mediaTableIndicHidden');
const _mediaTableIndicWasPalayed = $('#mediaTableIndicWasPlayed');

let mediaTable = [];
let mediaWasPlayed = [];

function fetchMediaTable() {
  $.ajax({
    type: 'GET',
    url: '/api/media',
    dataType: 'json',
    success: (response) => {
      mediaTable = response;
      mediaWasPlayed = [];
      setMediaTableDOMWithFilter();
    },
    error: (xhr, status, error) => {
      console.error('Fehler beim GET-Request:', error);
    },
  });
}

function setMediaTableDOM(media = mediaTable) {
  $('#mediaTable').html(
    media.map(
      (media) => `
        <tr id="mediaTableMedia-${media.id}" class="user-select-none">
            <td class="align-middle" onclick="mediaTableMediaClick(${media.id})">
            <div class="mediaTableTypeFrame d-flex justify-content-center align-items-center pe-none">
              ${media.type === 'video' ? '<i class="fa fa-video"></i>' : ''}
              ${media.type === 'audio' ? '<i class="fa fa-volume-off"></i>' : ''}
              ${media.type === 'teleprompt' ? '<i class="fa fa-align-left"></i>' : ''}
            </div>
          </td>
          <td class="align-middle w-100" onclick="mediaTableMediaClick(${media.id})">
            <div class="d-flex align-items-center text-light pe-none">
              ${media.name.replace(/(\.mp4|\.mp3|\.teleprompt\.txt)$/, '')}
            </div>
          </td>
          <td class="align-middle mediaWasPlayed text-end" onclick="removeFromMediaWasPlayed(${media.id})"></td>
        </tr>
      `,
    ),
  );
  _mediaTableIndicCount.text(mediaTable.length);
  _mediaTableIndicHidden.text(mediaTable.length - media.length);
  _mediaTableIndicWasPalayed.text(mediaWasPlayed.length);
  updateMediaWasPlayed();
}

function setMediaTableDOMWithFilter() {
  let media = mediaTable;

  if ($('#mediaTableFilterHideUnknown').is(':checked'))
    media = media.filter((media) => media.type !== 'unknown');

  if ($('#mediaTableFilterHideMedia').is(':checked'))
    media = media.filter(
      (media) => media.type !== 'video' && media.type !== 'audio',
    );

  if ($('#mediaTableFilterHideTeleprompt').is(':checked'))
    media = media.filter((media) => media.type !== 'teleprompt');

  if ($('#mediaTableFilterHideChecked').is(':checked'))
    media = media.filter((media) => !mediaWasPlayed.includes(media.id));

  setMediaTableDOM(media);
}

function updateMediaWasPlayed() {
  for (const { id } of mediaTable)
    $(`#mediaTableMedia-${id} .mediaWasPlayed`).html(
      mediaWasPlayed.includes(id)
        ? '<i class="fa fa-check text-success"></i>'
        : '',
    );
}

function addToMediaWasPlayed(id) {
  mediaWasPlayed.push(id);
  updateMediaWasPlayed();
  setMediaTableDOMWithFilter();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function removeFromMediaWasPlayed(id) {
  mediaWasPlayed = mediaWasPlayed.filter((value) => value !== id);
  updateMediaWasPlayed();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function mediaTableMediaClick(id) {
  const media = mediaTable.find((media) => media.id === id);
  if (media) {
    if (media.type === 'teleprompt') {
      loadTeleprompt(media);
      addToMediaWasPlayed(media.id);
    } else if (videoConnected) {
      videoSocketSendPlay(media.src);
      addToMediaWasPlayed(media.id);
    }
  }
}

fetchMediaTable();
