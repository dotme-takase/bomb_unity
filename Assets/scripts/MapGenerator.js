class MapConnect{
	var n = false;
	var s = false;
	var w = false;
	var e = false;
}

class MapArea{
    var isRoom = false;
    var cX1:int;
    var cX2:int;
    var cY1:int;
    var cY2:int;
    var northEnd:int;
    var southEnd:int;
    var westEnd:int;
    var eastEnd:int;
    var connected:MapConnect = new MapConnect();
    var isRoute:boolean;
    var areaX:int;
    var areaY:int;
}

class MapGenerator { 
	var result:String[,];
    var areaWidth = 5;
    var areaHeight = 5;
    var areaXSize = 5;  
    var areaYSize = 5;
    var areaList:MapArea[,]; 
     
    public var generate = function (_areaXSize, _areaYSize) {
        if (_areaXSize) {
            areaXSize = _areaXSize;
        }
        if (_areaYSize) {
            areaYSize = _areaYSize;
        }
        areaList = new MapArea[areaXSize, areaYSize];

        var mapWidth = areaWidth * areaXSize;
        var mapHeight = areaHeight * areaYSize;
        result = new String[mapWidth, mapHeight];
        for (var y1 = 0; y1 < mapHeight; y1++) {
            for (var x1 = 0; x1 < mapWidth; x1++) {
            	var n:String= null; 
                result[x1, y1] = n;
            }
        }

        var areaCount = 0;
        var roomCount = 0;
        for (var y2 = 0; y2 < areaYSize; y2++) {
            var areaLine = [];
            for (var x2 = 0; x2 < areaXSize; x2++) {
                var offX = x2 * areaWidth;
                var offY = y2 * areaHeight;
                var northEnd = 0;
                var southEnd = 0;
                var westEnd = 0;
                var eastEnd = 0;

                var isRoom = false;
                if ((areaCount >= areaXSize) && (roomCount == 0)) {
                    isRoom = true;
                }
                if (isRoom) {
                    var mN = Mathf.Ceil(Random.value * 2);
                    for (var m1 = 0; m1 < mN; m1++) {
                        var my1 = offY + m1;
                        for (var _mx1 = 0; _mx1 < areaWidth; _mx1++) {
                            var mx1 = offX + _mx1;
                            if (m1 == mN - 1) {
                                result[mx1, my1] = "w1_t1";
                                northEnd = my1;
                            } else {
                                result[mx1, my1] = "w1";
                            }
                        }
                    }
                    //SouthWall
                    var mS = Mathf.Ceil(Random.value * 2);
                    for (var m2 = 0; m2 < mS; m2++) {
                        var my2 = offY + areaHeight - m2 - 1;
                        for (var _mx2 = 0; _mx2 < areaWidth; _mx2++) {
                            var mx2 = offX + _mx2;
                            if (m2 == mS - 1) {
                                result[mx2, my2] = "w1_b1";
                                southEnd = my2;
                            } else {
                                result[mx2, my2] = "w1";
                            }
                        }
                    }

                    //WestWall
                    var mW = Mathf.Ceil(Random.value * 2);
                    for (var m3 = 0; m3 < mW; m3++) {
                        var mx3 = offX + m3;
                        for (var _my3 = 0; _my3 < areaHeight; _my3++) {
                            var my3 = offY + _my3;
                            if (m3 == mW - 1) {
                                if (my3 == northEnd) {
                                    result[mx3, my3] = "w1_tl1";
                                } else if (my3 == southEnd) {
                                    result[mx3, my3] = "w1_bl1";
                                } else if (result[mx3, my3] == null) {
                                    result[mx3, my3] = "w1_l1";
                                }
                                westEnd = mx3;
                            } else {
                                result[mx3, my3] = "w1";
                            }
                        }
                    }
                    //EastWall
                    var mE = Mathf.Ceil(Random.value * 2);
                    for (var m4 = 0; m4 < mE; m4++) {
                        var mx4 = offX + areaWidth - m4 - 1;
                        for (var _my4 = 0; _my4 < areaHeight; _my4++) {
                            var my4 = offY + _my4;
                            if (m4 == mE - 1) {
                                if (my4 == northEnd) {
                                    result[mx4, my4] = "w1_tr1";
                                } else if (my4 == southEnd) {
                                    result[mx4, my4] = "w1_br1";
                                } else if (result[mx4, my4] == null) {
                                    result[mx4, my4] = "w1_r1";
                                }
                                eastEnd = mx4;
                            } else {
                                result[mx4, my4] = "w1";
                            }
                        }
                    }
                    var cX1 = westEnd + 1;
                    var cX2 = westEnd + 1;
                    if (eastEnd - westEnd > 2) {
                        cX1 += Mathf.Round(Random.value * (eastEnd - westEnd - 2));
                        cX2 += Mathf.Round(Random.value * (eastEnd - westEnd - 2));
                        //cX1 += (eastEnd - westEnd - 2);
                    }
                    var cY1 = northEnd + 1;
                    var cY2 = northEnd + 1;
                    if (southEnd - northEnd > 2) {
                        cY1 += Mathf.Round(Random.value * (southEnd - northEnd - 2));
                        cY2 += Mathf.Round(Random.value * (southEnd - northEnd - 2));
                        //cY1 += (southEnd - northEnd - 2);
                    }

                    var newArea = new MapArea();
                    newArea.isRoom = true;
                    newArea.cX1 = cX1;
                    newArea.cX2 = cX2;
                    newArea.cY1 = cY1;
                    newArea.cY2 = cY2;
                    newArea.northEnd = northEnd;
                    newArea.southEnd = southEnd;
                    newArea.westEnd = westEnd;
                    newArea.eastEnd = eastEnd;
                    newArea.connected = new MapConnect();
                    newArea.isRoute = false;
                    newArea.areaX = x2;
                    newArea.areaY = y2;
                    areaList[x2, y2] = newArea;
                    roomCount++;
                } else {
                    for (var _mx = 0; _mx < areaWidth; _mx++) {
                        var mx = offX + _mx;
                        for (var _my = 0; _my < areaWidth; _my++) {
                            var my = offY + _my;
                            result[mx, my] = "w1";
                        }
                    }
                    var dummyArea = new MapArea();
                    dummyArea.isRoom = false;
                    dummyArea.connected = new MapConnect();
                    dummyArea.isRoute = false;
                    dummyArea.areaX = x2;
                    dummyArea.areaY = y2; 
                    areaList[x2, y2] = dummyArea;                 
                }
                areaCount++;
            }
        };

        for (var y3 = 0; y3 < areaYSize; y3++) {
            for (var x3 = 0; x3 < areaXSize; x3++) {
                var area:MapArea = areaList[x3, y3];
                if (area.isRoom == true) {
                    if ((y3 == 0) && (x3 == 0)) {
                        area.isRoute = true;
                    }
                    var rootDice = Mathf.CeilToInt(Random.value * 3);
                    var conS = (rootDice & 1);
                    if (conS && (y3 + 1 < areaYSize)) {
                        connectNorthSouth(area, areaList[x3, y3 + 1]);
                    }
                    var conE = (rootDice & 2);
                    if (conE && (x3 + 1 < areaXSize)) {
                        connectEastWest(area, areaList[x3 + 1, y3]);
                    }
                }
            }
        };

        for (var y4 = 0; y4 < areaYSize; y4++) {
            for (var x4 = 0; x4 < areaXSize; x4++) {
                var area4:MapArea = areaList[x4, y4];
                if (!area4.isRoute) {
                    forceRoute(area4);
                }
            }
        }
        return result;
    };  
    
    function dig(tnX: int, tnY: int) {
        if (result[tnX, tnY] != null) {
            result[tnX, tnY] = null;
            if (result[tnX, tnY - 1] == "w1") {
                result[tnX, tnY - 1] = "w1_t1";
            }
            if (result[tnX, tnY + 1] == "w1") {
                result[tnX, tnY + 1] = "w1_b1";
            }
            if (result[tnX - 1, tnY] == "w1") {
                result[tnX - 1, tnY] = "w1_l1";
            }
            if (result[tnX + 1, tnY] == "w1") {
                result[tnX + 1, tnY] = "w1_r1";
            }
        }
    }

    function connectNorthSouth(area1: MapArea, area2: MapArea) { 
        var tnX:int;
        var tnY:int;
        if (area1.isRoom) {
            if (area2.isRoom) {
                area1.connected.s = true;
                area2.connected.n = true;
                if (area1.isRoute) {
                    area2.isRoute = true;
                }
                if (area2.northEnd - area1.southEnd <= 3) {
                    if (area1.cX2 > area2.eastEnd - 1) {
                        area1.cX2 = area2.eastEnd - 1;
                    } else if (area1.cX2 < area2.westEnd + 1) {
                        area1.cX2 = area2.westEnd + 1;
                    }
                    area2.cX1 = area1.cX2;
                    tnX = area1.cX2;
                    for (tnY = area1.southEnd; tnY < area2.northEnd; tnY++) {
                        dig(tnX, tnY);
                    }
                } else {
                    tnX = area1.cX2;
                    for (tnY = area1.southEnd; tnY < area2.northEnd; tnY++) {
                        dig(tnX, tnY);
                        if (tnY == area1.southEnd + 2) {
                            if (tnX < area2.cX1) {
                                if (result[tnX - 1, tnY + 1] != null) {
                                    result[tnX - 1, tnY + 1] = "w1_bl1";
                                }
                                if (result[tnX + 1, tnY - 1] != null) {
                                    result[tnX + 1, tnY - 1] = "w1_tr2";
                                }
                                for (tnX = tnX + 0;tnX <= area2.cX1; tnX++) {
                                    dig(tnX, tnY);
                                    if (tnX == area2.cX1) {
                                        if (result[tnX + 1, tnY - 1] != null) {
                                            result[tnX + 1, tnY - 1] = "w1_tr1";
                                        }
                                        if (result[tnX - 1, tnY + 1] != null) {
                                            result[tnX - 1, tnY + 1] = "w1_bl2";
                                        }
                                    }
                                }
                            } else if (tnX > area2.cX1) {
                                if (result[tnX + 1, tnY + 1] != null) {
                                    result[tnX + 1, tnY + 1] = "w1_br1";
                                }
                                if (result[tnX - 1, tnY - 1] != null) {
                                    result[tnX - 1, tnY - 1] = "w1_tl2";
                                }
                                for (tnX = tnX + 0; tnX >= area2.cX1; tnX--) {
                                    dig(tnX, tnY);
                                    if (tnX == area2.cX1) {
                                        if (result[tnX - 1, tnY - 1] != null) {
                                            result[tnX - 1, tnY - 1] = "w1_tl1";
                                        }
                                        if (result[tnX + 1, tnY + 1] != null) {
                                            result[tnX + 1, tnY + 1] = "w1_br2";
                                        }
                                    }
                                }
                            }
                            tnX = area2.cX1;
                        }
                    }
                }
            }
            result[area1.cX2 - 1, area1.southEnd] = "w1_bl2";
            result[area1.cX2 + 1, area1.southEnd] = "w1_br2";
            if (area1.cX2 == area1.westEnd + 1) {
                if (result[area1.cX2 - 1, area1.southEnd - 1] != null) {
                    result[area1.cX2 - 1, area1.southEnd] = "w1_l1";
                }
            }
            if (area1.cX2 == area1.eastEnd - 1) {
                if (result[area1.cX2 + 1, area1.southEnd - 1] != null) {
                    result[area1.cX2 + 1, area1.southEnd] = "w1_r1";
                }
            }
            result[area1.cX2, area1.southEnd] = null;
        }

        if (area2.isRoom) {
            result[area2.cX1 - 1, area2.northEnd] = "w1_tl2";
            result[area2.cX1 + 1, area2.northEnd] = "w1_tr2";
            if (area2.cX1 == area2.westEnd + 1) {
                if (result[area2.cX1 - 1, area2.northEnd + 1] != null) {
                    result[area2.cX1 - 1, area2.northEnd] = "w1_l1";
                }
            }
            if (area2.cX1 == area2.eastEnd - 1) {
                if (result[area2.cX1 + 1, area2.northEnd + 1] != null) {
                    result[area2.cX1 + 1, area2.northEnd] = "w1_r1";
                }
            }
            result[area2.cX1, area2.northEnd] = null;
        }
    }

    function connectEastWest(area1: MapArea, area2: MapArea) { 
    	var tnX:int;
     	var tnY:int;
        if (area1.isRoom) {
            if (area2.isRoom) {
                area1.connected.w = true;
                area2.connected.e = true;
                if (area1.isRoute) {
                    area2.isRoute = true;
                }
                if (area2.westEnd - area1.eastEnd <= 3) {
                    if (area1.cY2 > area2.southEnd - 1) {
                        area1.cY2 = area2.southEnd - 1;
                    } else if (area1.cY2 < area2.northEnd + 1) {
                        area1.cY2 = area2.northEnd + 1;
                    }
                    area2.cY1 = area1.cY2;
                    tnY = area1.cY2;
                    for (tnX = area1.eastEnd; tnX < area2.westEnd; tnX++) {
                        dig(tnX, tnY);
                    }
                } else {
                    tnY = area1.cY2;
                    for (tnX = area1.eastEnd; tnX < area2.westEnd; tnX++) {
                        dig(tnX, tnY);
                        if (tnX == area1.eastEnd + 2) {
                            if (tnY < area2.cY1) {
                                if (result[tnX - 1, tnY + 1] != null) {
                                    result[tnX - 1, tnY + 1] = "w1_bl2";
                                }
                                if (result[tnX + 1, tnY - 1] != null) {
                                    result[tnX + 1, tnY - 1] = "w1_tr1";
                                }
                                for (tnY = tnY + 0; tnY <= area2.cY1; tnY++) {
                                    dig(tnX, tnY);
                                    if (tnY == area2.cY1) {
                                        if (result[tnX - 1, tnY + 1] != null) {
                                            result[tnX - 1, tnY + 1] = "w1_bl1";
                                        }
                                        if (result[tnX + 1, tnY - 1] != null) {
                                            result[tnX + 1, tnY - 1] = "w1_tr2";
                                        }
                                    }
                                }
                            } else if (tnY > area2.cY1) {
                                if (result[tnX - 1, tnY - 1] != null) {
                                    result[tnX - 1, tnY - 1] = "w1_tl2";
                                }
                                if (result[tnX + 1, tnY + 1] != null) {
                                    result[tnX + 1, tnY + 1] = "w1_br1";
                                }
                                for (tnY = tnY + 0; tnY >= area2.cY1; tnY--) {
                                    dig(tnX, tnY);
                                    if (tnY == area2.cY1) {
                                        if (result[tnX - 1, tnY - 1] != null) {
                                            result[tnX - 1, tnY - 1] = "w1_tl1";
                                        }
                                        if (result[tnX + 1, tnY + 1] != null) {
                                            result[tnX + 1, tnY + 1] = "w1_br2";
                                        }
                                    }
                                }
                            }
                            tnY = area2.cY1;
                        }
                    }
                }
            }
            result[area1.eastEnd, area1.cY2 - 1] = "w1_tr2";
            result[area1.eastEnd, area1.cY2 + 1] = "w1_br2";
            if (area1.cY2 == area1.northEnd + 1) {
                if (result[area1.eastEnd - 1, area1.cY2 - 1] != null) {
                    result[area1.eastEnd, area1.cY2 - 1] = "w1_t1";
                }
            }
            if (area1.cY2 == area1.southEnd - 1) {
                if (result[area1.eastEnd - 1, area1.cY2 + 1] != null) {
                    result[area1.eastEnd, area1.cY2 + 1] = "w1_b1";
                }
            }
            result[area1.eastEnd, area1.cY2] = null;
        }

        if (area2.isRoom) {
            result[area2.westEnd, area2.cY1 - 1] = "w1_tl2";
            result[area2.westEnd, area2.cY1 + 1] = "w1_bl2";
            if (area2.cY1 == area2.northEnd + 1) {
                if (result[area2.westEnd + 1, area2.cY1 - 1] != null) {
                    result[area2.westEnd, area2.cY1 - 1] = "w1_t1";
                }
            }
            if (area2.cY1 == area2.southEnd - 1) {
                if (result[area2.westEnd + 1, area2.cY1 + 1] != null) {
                    result[area2.westEnd, area2.cY1 + 1] = "w1_b1";
                }
            }
            result[area2.westEnd, area2.cY1] = null;
        }
    }
    
    function forceRoute(area:MapArea) {
        if (area.isRoom) {
            var nextArea:MapArea = null;
            if (area.areaY > 0 && !area.connected.n) {
                nextArea = areaList[area.areaX, area.areaY - 1];
                if (nextArea.isRoom) {
                    connectNorthSouth(nextArea, area);
                }
            } else if (area.areaY < areaYSize - 1 && !area.connected.s) {
                nextArea = areaList[area.areaX, area.areaY + 1];
                if (nextArea.isRoom) {
                    connectNorthSouth(area, nextArea);
                }
            } else if (area.areaX > 0 && !area.connected.e) {
                nextArea = areaList[area.areaX - 1, area.areaY];
                if (nextArea.isRoom) {
                    connectEastWest(nextArea, area);
                }
            } else if (area.areaX < areaXSize - 1 && !area.connected.w) {
                nextArea = areaList[area.areaX + 1, area.areaY];
                if (nextArea.isRoom) {
                    connectEastWest(area, nextArea);
                }
            }

            if ((nextArea != null) && (!nextArea.isRoute)) {
                forceRoute(nextArea);
            }
        }
    }
}