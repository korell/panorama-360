import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import './App.scss'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";


function run(canvas) {
    const scene = new THREE.Scene()

    const axes = new THREE.AxesHelper(2)
    scene.add(axes)

    const geometry = new THREE.SphereGeometry(10)
    const texture = new THREE.TextureLoader().load('foret-360.jpeg')
    texture.wrapS = THREE.RepeatWrapping
    texture.repeat.x *= -1
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
    })
    const sphere = new THREE.Mesh(geometry, material)

    scene.add(sphere)

    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    const camera = new THREE.PerspectiveCamera(65, sizes.width / sizes.height, 0.1, 1000)
    camera.position.set(0,0,5)
    camera.lookAt(0,0,0)
    scene.add(camera)

    const imageAdd = new THREE.TextureLoader().load('add.png')
    const materialAdd = new THREE.SpriteMaterial({map: imageAdd})
    const spriteAdd = new THREE.Sprite(materialAdd)
    const pathSpritePosition = new THREE.Vector3(
            6.26206223118457,
            -3.453281523826447,
            -6.90090054895113
    )

    const pos = pathSpritePosition.clone().normalize().multiplyScalar(9)
    console.log(pos)
    spriteAdd.position.copy(pos)

    // spriteAdd.position.y = 2
    // spriteAdd.position.z = -9.5
    // spriteAdd.position.x = 0
    //spriteAdd.scale.set(0.2,0.2,0.2)
    scene.add(spriteAdd)


    const renderer = new THREE.WebGLRenderer({
        canvas
    })
    renderer.setSize(sizes.width, sizes.height)

    // const controls = new OrbitControls(camera, renderer.domElement)
    // controls.enableDamping = true
    // controls.rotateSpeed *= -0.3
    // controls.enableZoom = false
    //
    // controls.update()

    //renderer.render(scene, camera)

    const tick = () => {
        requestAnimationFrame(tick)
        //controls.update()
        renderer.render(scene, camera)
    }
    tick()


    window.addEventListener('resize', () => {
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix();
        renderer.setSize(sizes.width, sizes.height)
    })


    document.addEventListener('mousemove', (ev) => {
        const mouse = new THREE.Vector2(
            (ev.clientX / window.innerWidth) - 0.5,
            (ev.clientY / window.innerHeight) - 0.5
        )
        camera.position.y = mouse.y * 2
        camera.position.x = mouse.x * -2
        camera.lookAt(0,0,0)

    })

    document.addEventListener('click', (ev) => {
        console.log(ev)
        const mouse = new THREE.Vector2(
            (ev.clientX / window.innerWidth) * 2 - 1,
            (ev.clientY / window.innerHeight) * -2 + 1
        )

        const raycaster = new THREE.Raycaster()
        raycaster.setFromCamera(mouse, camera)
        const intersect = raycaster.intersectObject(sphere)
        console.log(intersect[0].point)
    })

    // document.addEventListener('scroll', () => {
    //     const scrollPosition = (window.scrollY / (document.body.offsetHeight - window.innerHeight)) - 0.5
    //     console.log(scrollPosition)
    //     camera.position.y = (scrollPosition * -1 * 10) - 2
    //     camera.lookAt(0,0,0)
    //     camera.updateProjectionMatrix()
    // })
}


function App() {
    const canvas = useRef(null)
    let isInit = false
    useEffect(() => {
        if(isInit) return
        isInit = true
        console.log(canvas)
        run(canvas.current)
    }, [])
    return (
        <>
            <div className="content">TEST</div>
            <canvas ref={canvas} className="webgl"></canvas>
        </>
    )
}

export default App
