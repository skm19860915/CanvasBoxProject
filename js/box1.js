var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.beginPath();
ctx.strokeStyle='blue';
ctx.font = "15px Arial";
ctx.textAlign = "center";
var bid = 1;

var defaultX = d[bid].size[0];
var defaultY = d[bid].size[1];
var defaultZ = d[bid].size[2];
var defaultWing = d[bid].size[3];
document.getElementById("sizeX").value = defaultX;
document.getElementById("sizeY").value = defaultY;
document.getElementById("sizeZ").value = defaultZ;
document.getElementById("sizeWing").value = defaultWing;

for (var i = 0; i < d[bid].data.length; i++) 
{
    var points = d[bid].data[i];

    for (var j = 0; j < points.length; j++) 
    {
        var isArray = Array.isArray(points[j]);
        
        if (isArray) 
        {
            if (j === 0)
                ctx.moveTo(points[j][0], points[j][1]);
            else 
            {
                // curve
                if (points[j].length > 3)
                    ctx.bezierCurveTo(points[j][0], points[j][1], points[j][2], points[j][3], points[j][4], points[j][5]);
                // line    
                else
                    ctx.lineTo(points[j][0], points[j][1]);
            }
        }
    }
}
ctx.stroke();

function getSize() 
{
    var x = document.getElementById("sizeX").value;
    var y = document.getElementById("sizeY").value;
    var z = document.getElementById("sizeZ").value;
    var wing = document.getElementById("sizeWing").value;
    console.log(x,"....", y, ".....", z);
    ctx.clearRect(0,0,c.width,c.height);
    ctx.beginPath();
    ctx.strokeStyle='black';
    ctx.lineWidth = 5;

    var offset_x = d[bid].size[0] - parseFloat(x);
    var offset_y = d[bid].size[1] - parseFloat(y);
    var offset_z = d[bid].size[2] - parseFloat(z);
    var offset_wing = 0; //d[bid].size[3] - parseFloat(wing);

    // in
    ctx.moveTo(d[bid].data[0][0][0] + offset_x/2,d[bid].data[0][0][1] + offset_y/2); 
    ctx.lineTo(d[bid].data[0][1][0] + offset_x/2,d[bid].data[0][1][1] + offset_y/2);
    // wing in
    ctx.moveTo(d[bid].data[1][0][0] + offset_x/2 + offset_z,d[bid].data[1][0][1] + offset_y/2); 
    ctx.lineTo(d[bid].data[1][1][0] + offset_x/2,d[bid].data[1][1][1] + offset_y/2);
    
    ctx.moveTo(d[bid].data[2][0][0] + offset_x/2,d[bid].data[2][0][1] + offset_y/2); 
    ctx.lineTo(d[bid].data[2][1][0] - offset_x/2,d[bid].data[2][1][1] + offset_y/2);

    ctx.moveTo(d[bid].data[3][0][0] - offset_x/2,d[bid].data[3][0][1] + offset_y/2); 
    ctx.lineTo(d[bid].data[3][1][0] - offset_x/2,d[bid].data[3][1][1] + offset_y/2);

    ctx.moveTo(d[bid].data[4][0][0] + offset_x/2,d[bid].data[4][0][1] + offset_y/2); 
    ctx.lineTo(d[bid].data[4][1][0] + offset_x/2,d[bid].data[4][1][1] - offset_y/2);
    // X
    ctx.moveTo(d[bid].data[5][0][0] + offset_x/2,d[bid].data[5][0][1] + offset_y/2); 
    ctx.lineTo(d[bid].data[5][1][0] - offset_x/2,d[bid].data[5][1][1] + offset_y/2);
    // Y
    ctx.moveTo(d[bid].data[6][0][0] - offset_x/2,d[bid].data[6][0][1] + offset_y/2); 
    ctx.lineTo(d[bid].data[6][1][0] - offset_x/2,d[bid].data[6][1][1] - offset_y/2);
    // Z
    ctx.moveTo(d[bid].data[7][0][0] - offset_x/2,d[bid].data[7][0][1] + offset_y/2); 
    ctx.lineTo(d[bid].data[7][1][0] - offset_x/2 - offset_z,d[bid].data[7][1][1] + offset_y/2);

    ctx.moveTo(d[bid].data[8][0][0] + offset_x/2 + offset_z,d[bid].data[8][0][1] - offset_y/2); 
    ctx.lineTo(d[bid].data[8][1][0] + offset_x/2,d[bid].data[8][1][1] - offset_y/2);

    ctx.moveTo(d[bid].data[9][0][0] - offset_x/2 - offset_z,d[bid].data[9][0][1] + offset_y/2); 
    ctx.lineTo(d[bid].data[9][1][0] - offset_x/2 - offset_z,d[bid].data[9][1][1] - offset_y/2);
   
    ctx.moveTo(d[bid].data[10][0][0] - offset_x*1.5 - offset_z,d[bid].data[10][0][1] + offset_y/2); 
    ctx.lineTo(d[bid].data[10][1][0] - offset_x*1.5 - offset_z,d[bid].data[10][1][1] - offset_y/2);

    ctx.moveTo(d[bid].data[11][0][0] - offset_x/2,d[bid].data[11][0][1] - offset_y/2); 
    ctx.lineTo(d[bid].data[11][1][0] - offset_x/2 - offset_z,d[bid].data[11][1][1] - offset_y/2);

    ctx.moveTo(d[bid].data[12][0][0] - offset_x/2 - offset_z,d[bid].data[12][0][1] - offset_y/2); 
    ctx.lineTo(d[bid].data[12][1][0] - offset_x*1.5 - offset_z,d[bid].data[12][1][1] - offset_y/2);

    ctx.moveTo(d[bid].data[13][0][0] - offset_x/2 - offset_z,d[bid].data[13][0][1] - offset_y/2); 
    ctx.lineTo(d[bid].data[13][1][0] - offset_x*1.5 - offset_z,d[bid].data[13][1][1] - offset_y/2);

    // out
    ctx.moveTo(d[bid].data[14][0][0] + offset_x/2,d[bid].data[14][0][1] + offset_y/2);
    ctx.bezierCurveTo
    (
        d[bid].data[14][1][0] + offset_x/2,d[bid].data[14][1][1] + offset_y/2,
        d[bid].data[14][1][2] + offset_x/2,d[bid].data[14][1][3] + offset_y/2,
        d[bid].data[14][1][4] + offset_x/2,d[bid].data[14][1][5] + offset_y/2,
    );

    ctx.moveTo(d[bid].data[15][0][0] + offset_x/2,d[bid].data[15][0][1] + offset_y/2); 
    ctx.lineTo(d[bid].data[15][1][0] - offset_x/2,d[bid].data[15][1][1] + offset_y/2);

    ctx.moveTo(d[bid].data[16][0][0] + offset_x/2 + offset_z,d[bid].data[16][0][1] + offset_y/2);
    ctx.bezierCurveTo
    (
        d[bid].data[16][1][0] + offset_x/2 + offset_z,d[bid].data[16][1][1] + offset_y/2,
        d[bid].data[16][1][2] + offset_x/2 + offset_z,d[bid].data[16][1][3] + offset_y/2,
        d[bid].data[16][1][4] + offset_x/2 + offset_z,d[bid].data[16][1][5] + offset_y/2,
    );

    ctx.moveTo(d[bid].data[17][0][0] + offset_x/2 + offset_z,d[bid].data[17][0][1] + offset_y/2); 
    ctx.lineTo(d[bid].data[17][1][0] + offset_x/2 + offset_z,d[bid].data[17][1][1] + offset_y/2);
    ctx.lineTo(d[bid].data[17][2][0] + offset_x/2 + offset_z,d[bid].data[17][2][1] + offset_y/2);
    ctx.lineTo(d[bid].data[17][3][0] + offset_x/2 + offset_z,d[bid].data[17][3][1] + offset_y/2);

    ctx.moveTo(d[bid].data[18][0][0] - offset_x/2,d[bid].data[18][0][1] + offset_y/2);
    ctx.bezierCurveTo
    (
        d[bid].data[18][1][0] - offset_x/2,d[bid].data[18][1][1] + offset_y/2,
        d[bid].data[18][1][2] - offset_x/2,d[bid].data[18][1][3] + offset_y/2,
        d[bid].data[18][1][4] - offset_x/2,d[bid].data[18][1][5] + offset_y/2,
    );

    ctx.moveTo(d[bid].data[19][0][0] - offset_x/2,d[bid].data[19][0][1] + offset_y/2); 
    ctx.lineTo(d[bid].data[19][1][0] - offset_x/2,d[bid].data[19][1][1] + offset_y/2);
    ctx.lineTo(d[bid].data[19][2][0] - offset_x/2,d[bid].data[19][2][1] + offset_y/2);

    ctx.moveTo(d[bid].data[20][0][0] + offset_x/2,d[bid].data[20][0][1] + offset_y/2); 
    ctx.lineTo(d[bid].data[20][1][0] + offset_x/2,d[bid].data[20][1][1] + offset_y/2);
    ctx.lineTo(d[bid].data[20][2][0] + offset_x/2,d[bid].data[20][2][1] + offset_y/2);
    // wing out
    ctx.moveTo(d[bid].data[21][0][0] + offset_x/2,d[bid].data[21][0][1] + offset_y/2); 
    ctx.lineTo(d[bid].data[21][1][0] + offset_x/2,d[bid].data[21][1][1] + offset_y/2 + offset_wing);
    ctx.lineTo(d[bid].data[21][2][0] + offset_x/2 + offset_z,d[bid].data[21][2][1] + offset_y/2 + offset_wing);

    ctx.moveTo(d[bid].data[22][0][0] + offset_x/2,d[bid].data[22][0][1] + offset_y/2);
    ctx.bezierCurveTo
    (
        d[bid].data[22][1][0] + offset_x/2,d[bid].data[22][1][1] + offset_y/2,
        d[bid].data[22][1][2] + offset_x/2,d[bid].data[22][1][3] + offset_y/2,
        d[bid].data[22][1][4] + offset_x/2,d[bid].data[22][1][5] + offset_y/2,
    );

    ctx.moveTo(d[bid].data[23][0][0] + offset_x/2,d[bid].data[23][0][1] + offset_y/2);
    ctx.bezierCurveTo
    (
        d[bid].data[23][1][0] + offset_x/2,d[bid].data[23][1][1] + offset_y/2,
        d[bid].data[23][1][2] + offset_x/2,d[bid].data[23][1][3] + offset_y/2,
        d[bid].data[23][1][4] + offset_x/2,d[bid].data[23][1][5] + offset_y/2,
    );

    ctx.moveTo(d[bid].data[24][0][0] - offset_x/2,d[bid].data[24][0][1] + offset_y/2);
    ctx.bezierCurveTo
    (
        d[bid].data[24][1][0] - offset_x/2,d[bid].data[24][1][1] + offset_y/2,
        d[bid].data[24][1][2] - offset_x/2,d[bid].data[24][1][3] + offset_y/2,
        d[bid].data[24][1][4] - offset_x/2,d[bid].data[24][1][5] + offset_y/2,
    );

    ctx.moveTo(d[bid].data[25][0][0] - offset_x/2,d[bid].data[25][0][1] + offset_y/2);
    ctx.bezierCurveTo
    (
        d[bid].data[25][1][0] - offset_x/2,d[bid].data[25][1][1] + offset_y/2,
        d[bid].data[25][1][2] - offset_x/2,d[bid].data[25][1][3] + offset_y/2,
        d[bid].data[25][1][4] - offset_x/2,d[bid].data[25][1][5] + offset_y/2,
    );

    ctx.moveTo(d[bid].data[26][0][0] - offset_x/2 - offset_z,d[bid].data[26][0][1] + offset_y/2 + offset_wing); 
    ctx.lineTo(d[bid].data[26][1][0] - offset_x/2,d[bid].data[26][1][1] + offset_y/2 + offset_wing);
    ctx.lineTo(d[bid].data[26][2][0] - offset_x/2,d[bid].data[26][2][1] + offset_y/2);

    ctx.moveTo(d[bid].data[27][0][0] - offset_x/2 - offset_z,d[bid].data[27][0][1] + offset_y/2 + offset_wing);
    ctx.bezierCurveTo
    (
        d[bid].data[27][1][0] - offset_x/2 - offset_z,d[bid].data[27][1][1] + offset_y/2 + offset_wing,
        d[bid].data[27][1][2] - offset_x/2 - offset_z,d[bid].data[27][1][3] + offset_y/2 + offset_wing,
        d[bid].data[27][1][4] - offset_x/2 - offset_z,d[bid].data[27][1][5] + offset_y/2 + offset_wing,
    );

    ctx.moveTo(d[bid].data[28][0][0] + offset_x/2 + offset_z,d[bid].data[28][0][1] - offset_y/2); 
    ctx.lineTo(d[bid].data[28][1][0] + offset_x/2 + offset_z,d[bid].data[28][1][1] + offset_y/2);

    ctx.moveTo(d[bid].data[29][0][0] + offset_x/2 + offset_z,d[bid].data[29][0][1] - offset_y/2); 
    ctx.lineTo(d[bid].data[29][1][0] + offset_x/2 + offset_z,d[bid].data[29][1][1] - offset_y/2);
    ctx.lineTo(d[bid].data[29][1][0] + offset_x/2 + offset_z,d[bid].data[29][1][2] - offset_y/2);

    ctx.moveTo(d[bid].data[30][0][0] - offset_x/2 - offset_z,d[bid].data[30][0][1] + offset_y/2); 
    ctx.lineTo(d[bid].data[30][1][0] - offset_x*1.5 - offset_z,d[bid].data[30][1][1] + offset_y/2);

    ctx.moveTo(d[bid].data[31][0][0] - offset_x*1.5 - offset_z,d[bid].data[31][0][1] + offset_y/2); 
    ctx.lineTo(d[bid].data[31][1][0] - offset_x*1.5 - offset_z,d[bid].data[31][1][1] + offset_y/2);

    ctx.moveTo(d[bid].data[32][0][0] - offset_x*1.5 - offset_z,d[bid].data[32][0][1] + offset_y/2); 
    ctx.lineTo(d[bid].data[32][1][0] - offset_x*1.5 - offset_z,d[bid].data[32][1][1] - offset_y/2);

    ctx.moveTo(d[bid].data[33][0][0] - offset_x/2 - offset_z,d[bid].data[33][0][1] + offset_y/2); 
    ctx.lineTo(d[bid].data[33][1][0] - offset_x/2 - offset_z,d[bid].data[33][1][1] + offset_y/2 + offset_wing/2);
    ctx.lineTo(d[bid].data[33][2][0] - offset_x/2 - offset_z,d[bid].data[33][2][1] + offset_y/2 + offset_wing/2);
    ctx.lineTo(d[bid].data[33][3][0] - offset_x/2 - offset_z,d[bid].data[33][3][1] + offset_y/2 + offset_wing);

    ctx.moveTo(d[bid].data[34][0][0] + offset_x/2 + offset_z,d[bid].data[34][0][1] - offset_y/2); 
    ctx.lineTo(d[bid].data[34][1][0] + offset_x/2 + offset_z,d[bid].data[34][1][1] - offset_y/2 - offset_wing);
    ctx.lineTo(d[bid].data[34][2][0] + offset_x/2,d[bid].data[34][2][1] - offset_y/2 - offset_wing);

    ctx.moveTo(d[bid].data[35][0][0] + offset_x/2,d[bid].data[35][0][1] - offset_y/2); 
    ctx.lineTo(d[bid].data[35][1][0] - offset_x/2,d[bid].data[35][1][1] - offset_y/2);
////////////////////////
    ctx.moveTo(d[bid].data[36][0][0] + offset_x/2,d[bid].data[36][0][1] - offset_y/2 - offset_wing);
    ctx.bezierCurveTo
    (
        d[bid].data[36][1][0] + offset_x/2,d[bid].data[36][1][1] - offset_y/2 - offset_wing,
        d[bid].data[36][1][2] + offset_x/2,d[bid].data[36][1][3] - offset_y/2 - offset_wing,
        d[bid].data[36][1][4] + offset_x/2,d[bid].data[36][1][5] - offset_y/2 - offset_wing,
    );

    ctx.moveTo(d[bid].data[37][0][0] + offset_x/2,d[bid].data[37][0][1] - offset_y/2); 
    ctx.lineTo(d[bid].data[37][1][0] + offset_x/2,d[bid].data[37][1][1] - offset_y/2);
    ctx.lineTo(d[bid].data[37][2][0] + offset_x/2,d[bid].data[37][2][1] - offset_y/2);
    ctx.lineTo(d[bid].data[37][3][0] + offset_x/2,d[bid].data[37][3][1] - offset_y/2);

    ctx.moveTo(d[bid].data[38][0][0] - offset_x/2,d[bid].data[38][0][1] - offset_y/2); 
    ctx.lineTo(d[bid].data[38][1][0] - offset_x/2,d[bid].data[38][1][1] - offset_y/2);
    ctx.lineTo(d[bid].data[38][2][0] - offset_x/2,d[bid].data[38][2][1] - offset_y/2);
    ctx.lineTo(d[bid].data[38][3][0] - offset_x/2,d[bid].data[38][3][1] - offset_y/2);

    ctx.moveTo(d[bid].data[39][0][0] - offset_x/2,d[bid].data[39][0][1] - offset_y/2); 
    ctx.lineTo(d[bid].data[39][1][0] - offset_x/2 - offset_z,d[bid].data[39][1][1] - offset_y/2);
    ctx.lineTo(d[bid].data[39][2][0] - offset_x/2 - offset_z,d[bid].data[39][2][1] - offset_y/2);

    ctx.moveTo(d[bid].data[40][0][0] - offset_x/2,d[bid].data[40][0][1] - offset_y/2);
    ctx.bezierCurveTo
    (
        d[bid].data[40][1][0] - offset_x/2,d[bid].data[40][1][1] - offset_y/2,
        d[bid].data[40][1][2] - offset_x/2,d[bid].data[40][1][3] - offset_y/2,
        d[bid].data[40][1][4] - offset_x/2,d[bid].data[40][1][5] - offset_y/2,
    );

    ctx.moveTo(d[bid].data[41][0][0] - offset_x/2 - offset_z,d[bid].data[41][0][1] - offset_y/2); 
    ctx.lineTo(d[bid].data[41][1][0] - offset_x/2 - offset_z,d[bid].data[41][1][1] - offset_y/2);
    ctx.lineTo(d[bid].data[41][2][0] - offset_x/2 - offset_z,d[bid].data[41][2][1] - offset_y/2);
    ctx.lineTo(d[bid].data[41][3][0] - offset_x/2 - offset_z,d[bid].data[41][3][1] - offset_y/2);

    ctx.moveTo(d[bid].data[42][0][0] - offset_x/2 - offset_z,d[bid].data[42][0][1] - offset_y/2);
    ctx.bezierCurveTo
    (
        d[bid].data[42][1][0] - offset_x/2 - offset_z,d[bid].data[42][1][1] - offset_y/2,
        d[bid].data[42][1][2] - offset_x/2 - offset_z,d[bid].data[42][1][3] - offset_y/2,
        d[bid].data[42][1][4] - offset_x/2 - offset_z,d[bid].data[42][1][5] - offset_y/2,
    );

    ctx.moveTo(d[bid].data[43][0][0] - offset_x/2 - offset_z,d[bid].data[43][0][1] - offset_y/2);
    ctx.bezierCurveTo
    (
        d[bid].data[43][1][0] - offset_x/2 - offset_z,d[bid].data[43][1][1] - offset_y/2,
        d[bid].data[43][1][2] - offset_x/2 - offset_z,d[bid].data[43][1][3] - offset_y/2,
        d[bid].data[43][1][4] - offset_x/2 - offset_z,d[bid].data[43][1][5] - offset_y/2,
    );

    ctx.moveTo(d[bid].data[44][0][0] - offset_x*1.5 - offset_z,d[bid].data[44][0][1] - offset_y/2); 
    ctx.lineTo(d[bid].data[44][1][0] - offset_x*1.5 - offset_z,d[bid].data[44][1][1] - offset_y/2);

    ctx.moveTo(d[bid].data[45][0][0] - offset_x/2 - offset_z,d[bid].data[45][0][1] - offset_y/2); 
    ctx.lineTo(d[bid].data[45][1][0] - offset_x/2 - offset_z,d[bid].data[45][1][1] - offset_y/2);

    ctx.moveTo(d[bid].data[46][0][0] - offset_x/2 - offset_z,d[bid].data[46][0][1] - offset_y/2);
    ctx.bezierCurveTo
    (
        d[bid].data[46][1][0] - offset_x/2 - offset_z,d[bid].data[46][1][1] - offset_y/2,
        d[bid].data[46][1][2] - offset_x/2 - offset_z,d[bid].data[46][1][3] - offset_y/2,
        d[bid].data[46][1][4] - offset_x/2 - offset_z,d[bid].data[46][1][5] - offset_y/2,
    );

    ctx.moveTo(d[bid].data[47][0][0] - offset_x/2 - offset_z,d[bid].data[47][0][1] - offset_y/2); 
    ctx.lineTo(d[bid].data[47][1][0] - offset_x*1.5 - offset_z,d[bid].data[47][1][1] - offset_y/2);

    ctx.moveTo(d[bid].data[48][0][0] - offset_x*1.5 - offset_z,d[bid].data[48][0][1] - offset_y/2); 
    ctx.lineTo(d[bid].data[48][1][0] - offset_x*1.5 - offset_z,d[bid].data[48][1][1] - offset_y/2);
    ctx.lineTo(d[bid].data[48][2][0] - offset_x*1.5 - offset_z,d[bid].data[48][2][1] - offset_y/2);
    ctx.lineTo(d[bid].data[48][3][0] - offset_x*1.5 - offset_z,d[bid].data[48][3][1] - offset_y/2);

    ctx.moveTo(d[bid].data[49][0][0] - offset_x*1.5 - offset_z,d[bid].data[49][0][1] - offset_y/2);
    ctx.bezierCurveTo
    (
        d[bid].data[49][1][0] - offset_x*1.5 - offset_z,d[bid].data[49][1][1] - offset_y/2,
        d[bid].data[49][1][2] - offset_x*1.5 - offset_z,d[bid].data[49][1][3] - offset_y/2,
        d[bid].data[49][1][4] - offset_x*1.5 - offset_z,d[bid].data[49][1][5] - offset_y/2,
    );

    ctx.moveTo(d[bid].data[50][0][0] - offset_x*1.5 - offset_z,d[bid].data[50][0][1] - offset_y/2); 
    ctx.lineTo(d[bid].data[50][1][0] - offset_x*1.5 - offset_z,d[bid].data[50][1][1] - offset_y/2);

    ctx.stroke();
   
}