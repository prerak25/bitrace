import * as THREE from 'three';

export class Car {
    public mesh: THREE.Group;

    constructor(color: string = '#ff0000') {
        this.mesh = new THREE.Group();

        // Main body - slimmer and more aerodynamic
        const bodyGeometry = new THREE.BoxGeometry(1.4, 0.4, 4);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: color });
        const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
        bodyMesh.position.set(0, 0.2, 0);
        this.mesh.add(bodyMesh);

        // Nose cone - more pointed
        const noseGeometry = new THREE.BoxGeometry(0.8, 0.3, 1.2);
        const noseMesh = new THREE.Mesh(noseGeometry, bodyMaterial);
        noseMesh.position.set(0, 0.15, 2);
        this.mesh.add(noseMesh);

        // Cockpit - more detailed
        const cockpitGeometry = new THREE.BoxGeometry(0.8, 0.3, 1);
        const cockpitMaterial = new THREE.MeshPhongMaterial({ color: '#111111' });
        const cockpitMesh = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
        cockpitMesh.position.set(0, 0.45, -0.2);
        this.mesh.add(cockpitMesh);

        // Cockpit halo (safety feature)
        const haloGeometry = new THREE.BoxGeometry(0.9, 0.1, 0.8);
        const haloMesh = new THREE.Mesh(haloGeometry, cockpitMaterial);
        haloMesh.position.set(0, 0.6, -0.2);
        this.mesh.add(haloMesh);

        // Side pods
        this.addSidePod(0.8, 0.2, -0.5, color);
        this.addSidePod(-0.8, 0.2, -0.5, color);

        // Wheels - larger and more detailed
        this.addWheel(0.75, 0, 1.2, true);   // Front Right
        this.addWheel(-0.75, 0, 1.2, true);  // Front Left
        this.addWheel(0.75, 0, -1.2, false); // Back Right
        this.addWheel(-0.75, 0, -1.2, false);// Back Left

        // Front wing - more complex
        this.addFrontWing(color);

        // Rear wing - more detailed
        this.addRearWing(color);

        // Engine intake above cockpit
        const intakeGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.6);
        const intakeMesh = new THREE.Mesh(intakeGeometry, bodyMaterial);
        intakeMesh.position.set(0, 0.6, -0.6);
        this.mesh.add(intakeMesh);

        // Add small details (T-wing, bargeboard elements)
        this.addAerodynamicDetails(color);
    }

    private addSidePod(x: number, y: number, z: number, color: string) {
        const podGeometry = new THREE.BoxGeometry(0.4, 0.3, 1.5);
        const podMaterial = new THREE.MeshPhongMaterial({ color: color });
        const podMesh = new THREE.Mesh(podGeometry, podMaterial);
        podMesh.position.set(x, y, z);
        this.mesh.add(podMesh);
    }

    private addWheel(x: number, y: number, z: number, isFront: boolean) {
        // Main wheel
        const wheelGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.6);
        const wheelMaterial = new THREE.MeshPhongMaterial({ color: '#111111' });
        const wheelMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelMesh.position.set(x, y, z);

        // Wheel rim detail
        const rimGeometry = new THREE.BoxGeometry(0.42, 0.58, 0.58);
        const rimMaterial = new THREE.MeshPhongMaterial({ color: '#777777' });
        const rimMesh = new THREE.Mesh(rimGeometry, rimMaterial);
        wheelMesh.add(rimMesh);

        this.mesh.add(wheelMesh);
    }

    private addFrontWing(color: string) {
        // Main front wing
        const wingGeometry = new THREE.BoxGeometry(2.2, 0.1, 0.4);
        const wingMaterial = new THREE.MeshPhongMaterial({ color: color });
        const wingMesh = new THREE.Mesh(wingGeometry, wingMaterial);
        wingMesh.position.set(0, 0, 2.2);
        this.mesh.add(wingMesh);

        // Wing endplates
        const endplateGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.6);
        const leftPlate = new THREE.Mesh(endplateGeometry, wingMaterial);
        const rightPlate = new THREE.Mesh(endplateGeometry, wingMaterial);
        leftPlate.position.set(-1.1, 0.1, 2.2);
        rightPlate.position.set(1.1, 0.1, 2.2);
        this.mesh.add(leftPlate);
        this.mesh.add(rightPlate);
    }

    private addRearWing(color: string) {
        // Main rear wing
        const wingGeometry = new THREE.BoxGeometry(2, 0.3, 0.4);
        const wingMaterial = new THREE.MeshPhongMaterial({ color: color });
        const wingMesh = new THREE.Mesh(wingGeometry, wingMaterial);
        wingMesh.position.set(0, 0.8, -1.8);
        this.mesh.add(wingMesh);

        // DRS flap
        const drsGeometry = new THREE.BoxGeometry(1.8, 0.1, 0.2);
        const drsMesh = new THREE.Mesh(drsGeometry, wingMaterial);
        drsMesh.position.set(0, 0.9, -1.8);
        this.mesh.add(drsMesh);

        // Wing endplates
        const endplateGeometry = new THREE.BoxGeometry(0.1, 0.6, 0.6);
        const leftPlate = new THREE.Mesh(endplateGeometry, wingMaterial);
        const rightPlate = new THREE.Mesh(endplateGeometry, wingMaterial);
        leftPlate.position.set(-1, 0.6, -1.8);
        rightPlate.position.set(1, 0.6, -1.8);
        this.mesh.add(leftPlate);
        this.mesh.add(rightPlate);
    }

    private addAerodynamicDetails(color: string) {
        // T-wing
        const tWingGeometry = new THREE.BoxGeometry(1, 0.1, 0.2);
        const tWingMaterial = new THREE.MeshPhongMaterial({ color: color });
        const tWingMesh = new THREE.Mesh(tWingGeometry, tWingMaterial);
        tWingMesh.position.set(0, 0.7, -1.4);
        this.mesh.add(tWingMesh);

        // Bargeboard elements
        const bargeboardGeometry = new THREE.BoxGeometry(0.1, 0.2, 0.8);
        const leftBargeboard = new THREE.Mesh(bargeboardGeometry, tWingMaterial);
        const rightBargeboard = new THREE.Mesh(bargeboardGeometry, tWingMaterial);
        leftBargeboard.position.set(-0.7, 0.1, 0.8);
        rightBargeboard.position.set(0.7, 0.1, 0.8);
        this.mesh.add(leftBargeboard);
        this.mesh.add(rightBargeboard);
    }
} 