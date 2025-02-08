let pieces = [];
let pieceWidth, pieceHeight;

document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function() {
                pieceWidth = img.width / 3;
                pieceHeight = img.height / 3;
                createPuzzle(img);
            };
        };
        reader.readAsDataURL(file);
    }
});

function createPuzzle(img) {
    const puzzleContainer = document.getElementById('puzzleContainer');
    puzzleContainer.innerHTML = '';
    pieces = [];

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const canvas = document.createElement('canvas');
            canvas.width = pieceWidth;
            canvas.height = pieceHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);
            canvas.classList.add('puzzle-piece');
            canvas.dataset.row = row;
            canvas.dataset.col = col;
            pieces.push(canvas);
            puzzleContainer.appendChild(canvas);
        }
    }

    shufflePieces();
}

function shufflePieces() {
    pieces.sort(() => Math.random() - 0.5);
    const puzzleContainer = document.getElementById('puzzleContainer');
    puzzleContainer.innerHTML = '';
    pieces.forEach(piece => puzzleContainer.appendChild(piece));
    addDragAndDrop();
}

function addDragAndDrop() {
    const puzzlePieces = document.querySelectorAll('.puzzle-piece');
    puzzlePieces.forEach(piece => {
        piece.addEventListener('dragstart', dragStart);
        piece.addEventListener('dragover', dragOver);
        piece.addEventListener('drop', drop);
    });
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.row + ',' + event.target.dataset.col);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain').split(',');
    const sourceRow = parseInt(data[0]);
    const sourceCol = parseInt(data[1]);
    const targetRow = parseInt(event.target.dataset.row);
    const targetCol = parseInt(event.target.dataset.col);

    swapPieces(sourceRow, sourceCol, targetRow, targetCol);
}

function swapPieces(sourceRow, sourceCol, targetRow, targetCol) {
    const sourceIndex = sourceRow * 3 + sourceCol;
    const targetIndex = targetRow * 3 + targetCol;

    const temp = pieces[sourceIndex];
    pieces[sourceIndex] = pieces[targetIndex];
    pieces[targetIndex] = temp;

    const puzzleContainer = document.getElementById('puzzleContainer');
    puzzleContainer.innerHTML = '';
    pieces.forEach(piece => puzzleContainer.appendChild(piece));
    addDragAndDrop();
}

function startGame() {
    shufflePieces();
}