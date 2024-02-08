let mediaTable = [];
function updateMediaTable() {
  $.ajax({
    type: 'GET',
    url: '/api/media',
    dataType: 'json',
    success: (response) => {
      mediaTable = response;
      mediaWasPlayed = [];
      $('#mediaTable').html(
        mediaTable.map(
          (media, index) => `
            <tr id="mediaTableMedia-${index}">
              <td class="align-middle" onclick="mediaTableMediaClick(${index})">
                <div class="mediaTableTypeFrame d-flex justify-content-center align-items-center pe-none">
                  ${media.mimetype.startsWith('video') ? '<i class="fa fa-video"></i>' : ''}
                  ${media.mimetype.startsWith('audio') ? '<i class="fa fa-volume-off"></i>' : ''}
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
    },
    error: (xhr, status, error) => {
      console.error('Fehler beim GET-Request:', error);
    },
  });
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
