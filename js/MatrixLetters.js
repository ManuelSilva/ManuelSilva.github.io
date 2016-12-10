var numberOfLetters = 100;
var lettersLoaded = 0;
var letters = new Array(numberOfLetters); 


function load_And_Draw(material){

    var loader = new THREE.FontLoader();
    
    loader.load( 'fonts/helvetiker_bold.typeface.js', function ( font ) {
        while(lettersLoaded != numberOfLetters){

            //document.getElementById('info').innerHTML = '<br>Loading - ' + ((lettersLoaded / numberOfLetters) * 100).toString();
            txt = parseInt(Math.random()*10).toString();


            var textGeo = new THREE.TextGeometry( txt, {

                font: font,

                size: 2,
                height: 1,
                curveSegments: 100,

                bevelThickness: 1,
                bevelSize: 1,
                bevelEnabled: false

            } );

            var mesh = new THREE.Mesh( textGeo , material);
            mesh.name = lettersLoaded;

            var x = (Math.random() > 0.5) ? -0.5 + Math.random() * 10 : -0.5 -Math.random() * 10;
            var y = 5 + Math.random() * 8;
            var z = (Math.random() > 0.5) ? Math.random() * 10 : -Math.random() * 10;

            mesh.position.set(x,y,z);

            scene_stt.add( mesh );

            //meta_scene.add(mesh);

            lettersLoaded++;
        }

        tag_all();

    } );

}

function tag_all(){
    scene_stt.traverse(function (node) {
        if(node instanceof THREE.Mesh)
        {
            letters[parseInt(node.name)] = node;
        }
    });

    if(lettersLoaded == numberOfLetters){
        loading = false;
    }
}

function rain(delta){
    var velocity = 0.4;

    for(var i = 0; i < numberOfLetters; i++){

        letters[i].position.y -= velocity*delta;
        
        if(letters[i].position.y < -6.0){
            letters[i].position.x = (Math.random() > 0.5) ? -0.5 + Math.random() * 10 : -0.5 -Math.random() * 10;
            letters[i].position.y = 5 + Math.random() * 10;
            letters[i].position.z = (Math.random() > 0.5) ? Math.random() * 4 : -Math.random() * 10;
        }
    }

}