define(function (require) {
    var jQuery = require('jquery');
    var THREE = require('three');
    var gameObjects = require('views/GameModules/gameObjects');
    var Character = require('views/GameModules/character');
    var World = require('views/GameModules/worldBuilder');
    var OBJLoader = require('OBJLoader');

    var BasicScene = {
        init: function () {
                gameObjects.scene = new THREE.Scene();
                gameObjects.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 10000);
                gameObjects.scene.add(gameObjects.camera);

                gameObjects.light = new THREE.DirectionalLight(0xffffff, 1);
                gameObjects.light.position.set(-600, 0, -600);
                gameObjects.scene.add(gameObjects.light);
                gameObjects.light1 = new THREE.DirectionalLight(0xffffff, 1);
                gameObjects.light1.position.set(600, 1800, 600);
                gameObjects.scene.add(gameObjects.light1);
                gameObjects.light2 = new THREE.DirectionalLight(0xffffff, 1);


                gameObjects.renderer = new THREE.WebGLRenderer();
                this.container = $('#game-canvas');

                gameObjects.firstCharacter = new Character.init({color: 0xff0000}, {x: 0.5, z: 0.5});


                gameObjects.scene.add(gameObjects.firstCharacter.mesh);
                // gameObjects.addPlayerToWorld(8, gameObjects.firstCharacter.mesh);
                // gameObjects.addPlayerToWorld(9, gameObjects.secondCharacter.mesh);
                gameObjects.firstCharacter.setControls('');

                World.init();
                gameObjects.scene.add(World.mesh);

                jQuery(window).resize(function () {
                    BasicScene.setAspect();
                });


            var loader = new THREE.OBJLoader();
            loader.load('../media/game/models/bomb/Bomb.obj', function (object) {
                var texture = THREE.ImageUtils.loadTexture('../media/game/models/bomb/texture.png', {}, function () {
                    gameObjects.renderer.render(gameObjects.scene, gameObjects.camera);
                });
                var materialObj = new THREE.MeshBasicMaterial({map: texture});
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        child.material = materialObj;
                        child.scale.set(5, 5, 5)
                    }});
                gameObjects.addBombToWorld(object,10,6,6);
            });
            var timerId = setInterval(function() {
                gameObjects.obstacles[gameObjects.objects[10].index].scale.y *= 1.2;
                gameObjects.obstacles[gameObjects.objects[10].index].scale.x *= 1.2;
                gameObjects.obstacles[gameObjects.objects[10].index].scale.z *= 1.2;
            }, 1000);
            setTimeout(function() {
                clearInterval(timerId);
            }, 3000);
        },
        addToDOM: function () {
            this.container.prepend(gameObjects.renderer.domElement);
            this.setAspect();
        },
        addPlayer: function (color, x, z) {
            gameObjects.firstCharacter = new Character.init({color: color}, {x: x, z: z});
            gameObjects.scene.add(gameObjects.secondCharacter.mesh);
        },
        setAspect: function () {
            var w = this.container.width();
            var h = jQuery(window).height();
            gameObjects.renderer.setSize(w, h);
            gameObjects.camera.aspect = w / h;
            gameObjects.camera.updateProjectionMatrix();
        },

        frame: function () {
            gameObjects.firstCharacter.motion();
            gameObjects.firstCharacter.setFocus(gameObjects.firstCharacter.mesh , 950);
            gameObjects.renderer.render(gameObjects.scene, gameObjects.camera);
        },
        dealloc: function () {
            gameObjects.scene = undefined;
            gameObjects.camera = undefined;
            gameObjects.light = undefined;
            gameObjects.renderer = undefined;
            gameObjects.firstCharacter = undefined;
            gameObjects.obstacles = [];
            gameObjects.objects = {};
        }
    };

    return BasicScene;
});