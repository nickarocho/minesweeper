// PSEUDO CODE
///////////////////////////////////////////////////////////////////////////
//  1. Initialize the data (state)                                        //
//     - Difficulty level (size of game grid/number of bombs)            //
//         - Determine ratio of bombs to squares                         //
//     - 8x8
//     - 16x16
//     - 100 x 100
//     - Randomize bomb placement
//  2. Render
//     - Display # of bombs
//     - Show timer (starting from zero)
//  3. Add event listeners
//     - On click, determine whether bomb or not
//     - Secondary click (shift + click or right click) to add FLAG or ?
//  4. Handle user click event
//     - If bomb, game over
//     - If empty, clear square and adjacent squares without bombs
//     - Display automatic number that shows # of adjacent bombs
//  5. Render
//     - Display automatic number that shows # of adjacent bombs
//
//   ****  Approach
//              Array of arrays
//              "Cell" class (representing what's in cell)
//              Has bomb true/false
//              "reveal" method (build in logic of bomb or not)
//
///////////////////////////////////////////////////////////////////////////

/*----- constants -----*/
/*----- app's state (variables) -----*/
/*----- cached element references -----*/
/*----- event listeners -----*/
/*----- functions -----*/