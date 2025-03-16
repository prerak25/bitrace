import * as THREE from 'three';

export class Track {
    public mesh: THREE.Group;

    constructor() {
        this.mesh = new THREE.Group();
        this.createTrack();
    }

    private createTrack() {
        // Create the main track surface
        const trackShape = new THREE.Shape();
        
        // Outer track points - scaled up by 3x
        trackShape.moveTo(-60, -30);
        trackShape.lineTo(60, -30);
        trackShape.quadraticCurveTo(75, -30, 75, -15);
        trackShape.lineTo(75, 15);
        trackShape.quadraticCurveTo(75, 30, 60, 30);
        trackShape.lineTo(-60, 30);
        trackShape.quadraticCurveTo(-75, 30, -75, 15);
        trackShape.lineTo(-75, -15);
        trackShape.quadraticCurveTo(-75, -30, -60, -30);

        // Create hole for inner track - scaled up by 3x
        const holeShape = new THREE.Path();
        holeShape.moveTo(-54, -24);
        holeShape.lineTo(54, -24);
        holeShape.quadraticCurveTo(69, -24, 69, -9);
        holeShape.lineTo(69, 9);
        holeShape.quadraticCurveTo(69, 24, 54, 24);
        holeShape.lineTo(-54, 24);
        holeShape.quadraticCurveTo(-69, 24, -69, 9);
        holeShape.lineTo(-69, -9);
        holeShape.quadraticCurveTo(-69, -24, -54, -24);

        trackShape.holes.push(holeShape);

        // Create track geometry
        const geometry = new THREE.ExtrudeGeometry(trackShape, {
            depth: 0.2,
            bevelEnabled: false
        });

        // Create materials
        const trackMaterial = new THREE.MeshPhongMaterial({
            color: '#333333', // Dark gray for asphalt
            shininess: 0      // Make it less shiny to look more like asphalt
        });

        const trackMesh = new THREE.Mesh(geometry, trackMaterial);
        trackMesh.rotation.x = -Math.PI / 2; // Lay flat
        this.mesh.add(trackMesh);

        // Add track markings
        this.addTrackMarkings();
    }

    private addTrackMarkings() {
        // Start/Finish line
        const startLineGeometry = new THREE.PlaneGeometry(2, 0.3);
        const startLineMaterial = new THREE.MeshPhongMaterial({
            color: '#ffffff',
            side: THREE.DoubleSide
        });
        const startLine = new THREE.Mesh(startLineGeometry, startLineMaterial);
        startLine.rotation.x = -Math.PI / 2;
        startLine.position.set(0, 0.01, 0); // Slightly above track
        this.mesh.add(startLine);

        // Add curbs (red and white stripes)
        this.addCurbs();
    }

    private addCurbs() {
        const curbGeometry = new THREE.BoxGeometry(3, 0.1, 1.5); // Scaled up curbs
        const redMaterial = new THREE.MeshPhongMaterial({ color: '#ff0000' });
        const whiteMaterial = new THREE.MeshPhongMaterial({ color: '#ffffff' });

        // Add curbs at corners - adjusted positions
        const curbPositions = [
            { x: 60, z: 0, rotation: 0 },
            { x: -60, z: 0, rotation: Math.PI },
            // Add more curb positions as needed
        ];

        curbPositions.forEach(pos => {
            for (let i = 0; i < 8; i++) {
                const curb = new THREE.Mesh(
                    curbGeometry,
                    i % 2 === 0 ? redMaterial : whiteMaterial
                );
                curb.position.set(
                    pos.x + Math.cos(pos.rotation) * i * 3, // Scaled spacing
                    0.01,
                    pos.z + Math.sin(pos.rotation) * i * 3
                );
                curb.rotation.y = pos.rotation;
                this.mesh.add(curb);
            }
        });
    }
} 