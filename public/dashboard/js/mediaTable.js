let mediaTable = [];
function updateMediaTable() {
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
      (media, index) => `
        <tr id="mediaTableMedia-${index}">
          <td class="align-middle" onclick="mediaTableMediaClick(${index})">
            <div class="mediaTableTypeFrame d-flex justify-content-center align-items-center pe-none">
              ${media.type === 'video' ? '<i class="fa fa-video"></i>' : ''}
              ${media.type === 'audio' ? '<i class="fa fa-volume-off"></i>' : ''}
              ${media.type === 'teleprompt' ? '<i class="fa fa-align-left"></i>' : ''}
            </div>
          </td>
          <td class="align-middle w-100" onclick="mediaTableMediaClick(${index})">
            <div class="d-flex align-items-center text-light pe-none">
              ${media.name}
            </div>
          </td>
          <td class="align-middle mediaWasPlayed text-end" onclick="removeFromMediaWasPlayed(${index})"></td>
        </tr>
      `,
    ),
  );
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
  setMediaTableDOM(media);
}

let mediaWasPlayed = [];
function updateMediaWasPlayed() {
  for (const index in mediaTable)
    $(`#mediaTableMedia-${index} .mediaWasPlayed`).html(
      mediaWasPlayed.includes(+index)
        ? '<i class="fa fa-check text-success"></i>'
        : '',
    );
}

function addToMediaWasPlayed(index) {
  mediaWasPlayed.push(index);
  updateMediaWasPlayed();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function removeFromMediaWasPlayed(index) {
  mediaWasPlayed = mediaWasPlayed.filter((value) => value !== index);
  updateMediaWasPlayed();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function mediaTableMediaClick(index) {
  const media = mediaTable[index];
  videoSocketSendPlay(media.src);
  addToMediaWasPlayed(index);
}

updateMediaTable();
