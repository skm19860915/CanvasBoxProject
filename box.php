<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <title>Dantwort Prototype</title>

        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
        <link rel="stylesheet" href="css/box.css">
        <link rel="stylesheet" type="text/css" href="css/default.css">
        <script type="text/javascript" src="js/jquery-3.3.1.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
        <!-- <script type="text/javascript" src="js/canvasbox1.js"></script> -->
        <!-- <script type="text/javascript" src="js/properties.js"></script> -->
        <script type="text/javascript" src="js/boxData.js"></script>
    </head>
    <body>
        <nav class="navbar navbar-default center">
            <div class="container-fluid">
                <div class="navbar-inner">
                    <ul class="nav navbar-nav">
                        <li class="active"><a href="#">Box 1</a></li>
                        <li><a href="#">Box 2</a></li>
                        <li><a href="#">Box 3</a></li>
                        <li><a href="#">Box 4</a></li>
                        <li><a href="#">Box 5</a></li>
                        <li><a href="#">Box 6</a></li>
                        <li><a href="#">Box 7</a></li>
                        <li><a href="#">Box 8</a></li>
                        <li><a href="#">Box 9</a></li>
                        <li><a href="#">Box 10</a></li>
                    </ul>
                </div>
               
            </div>
        </nav>
        <div class="container">
            <div class="row">
                <div class="col-md-10">
                    <canvas id="myCanvas" width="965.28" height="851" style="border:1px solid #d3d3d3;">Box1</canvas>
                </div>
                <div class="col-md-2">
                    <div id="dropdown">
                        <a class="menu"><span>Menu »</span></a>
                        <div class="submenu">
                            <ul class="root">
                                <li>
                                    <span>x</span><input type="text" id="sizeX" value="0" onfocusout="getSize()"><br>
                                    <span>y</span><input type="text" id="sizeY" value="0" onfocusout="getSize()"><br>
                                    <span>z</span><input type="text" id="sizeZ" value="0" onfocusout="getSize()"><br>
                                    <span>Cork</span><input type="text" id="sizeWing" value="0" onfocusout="getSize()"><br>
                                    <span>Wing</span><input type="text" value="0"><br>
                                </li>
                                <li><br><a onclick="javascript: LabGL.Export.savePDF();">Send to server</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script type="text/javascript" src="js/box1.js"></script>
    </body>
</html>
