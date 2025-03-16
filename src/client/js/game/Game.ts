import * as THREE from 'three';
import { Car } from '../models/Car';
import { Controls } from './Controls';
import { Track } from '../models/Track';

export class Game {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private car: Car;
    private track: Track;
    private controls: Controls;

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        const container = document.getElementById('game-container');
        if (container) {
            container.appendChild(this.renderer.domElement);
        }

        // Create a ground plane
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshPhongMaterial({ 
            color: '#3a7c2f',
            side: THREE.DoubleSide
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1;
        this.scene.add(ground);

        // Create and add car
        this.car = new Car('#ff0000');
        this.scene.add(this.car.mesh);

        // Create and add track
        this.track = new Track();
        this.scene.add(this.track.mesh);

        // Position car at start line and rotate to face the right direction
        if (this.car) {
            this.car.mesh.position.set(0, 0.5, 15); // Moved further forward on track
            this.car.mesh.rotation.y = 0; // Face forward along track
        }

        // Initial camera setup - lower and closer to rear
        this.camera.position.set(0, 3, 25);
        this.camera.lookAt(0, 1, 0);

        // Add stronger lighting for better visibility
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);

        // Add point lights for better detail visibility
        const frontLight = new THREE.PointLight(0xffffff, 0.5);
        frontLight.position.set(0, 2, 5);
        this.scene.add(frontLight);

        const backLight = new THREE.PointLight(0xffffff, 0.5);
        backLight.position.set(0, 2, -5);
        this.scene.add(backLight);

        // Handle window resizing
        window.addEventListener('resize', this.onWindowResize.bind(this), false);

        this.controls = new Controls();

        // Start the animation loop
        this.animate();
    }

    private onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private animate(): void {
        requestAnimationFrame(this.animate.bind(this));

        if (this.car) {
            this.car.update(this.controls);

            // Update camera to follow car from a lower, closer position
            const cameraOffset = new THREE.Vector3(0, 2, 6);
            const carPosition = this.car.mesh.position.clone();
            const cameraTarget = carPosition.clone();
            cameraTarget.y += 1;
            
            const carRotation = this.car.mesh.rotation.y;
            cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), carRotation);
            
            this.camera.position.copy(carPosition).add(cameraOffset);
            this.camera.lookAt(cameraTarget);
        }

        this.renderer.render(this.scene, this.camera);
    }
} 