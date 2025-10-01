
/*
Equations from:
http://paulbourke.net/fractals/peterdejong/
*/

document.addEventListener("DOMContentLoaded", function (event) {

	var MaxS = window.innerHeight * 0.8;  // maximum size canvas
	var defaultColor = "#E8E8E8";
	var scale = 4, // a scale factor
		yPos = 1; // y translation	

	var S; // size canvas
	var ga = { value: 1 };
	var pS = { value: 1 }; // the size of each particle position drawn
	var a = { value: 0 }, b = { value: 0 }, c = { value: 0 }, d = { value: 0 };
	var xp, x, y, i;
	var pi = Math.PI;
	var requestFrame = null;

	// theme 
	var dark = document.getElementById("dark-mode");
	var light = document.getElementById("light-mode");

	var colorInput = document.getElementById("colorInput");
	var particleColor = document.getElementById('particleColor');
	var colorPickerSpan = document.getElementById('colorPickerSpan');
	var slider_a = document.getElementById("slider_a");
	var slider_b = document.getElementById("slider_b");
	var slider_c = document.getElementById("slider_c");
	var slider_d = document.getElementById("slider_d");
	var input_a = document.getElementById("input_a");
	var input_b = document.getElementById("input_b");
	var input_c = document.getElementById("input_c");
	var input_d = document.getElementById("input_d");
	var cur_a = document.getElementById("cur_a");
	var cur_b = document.getElementById("cur_b");
	var cur_c = document.getElementById("cur_c");
	var cur_d = document.getElementById("cur_d");
	var static = document.getElementById("static");
	var motion = document.getElementById("motion");
	motion.style.borderColor = "#F15D22";
	var fullScreen = document.getElementById("full-screen");
	var isFullScreen = false;
	var canvasContainer = document.getElementById("canvas-container");
	var canvas = document.getElementById("canvas");
	canvas.width = MaxS;
	canvas.height = MaxS;
	var ctx = canvas.getContext("2d", { alpha: false });
	var play = document.getElementById("play");
	var pause = document.getElementById('pause');
	play.style.opacity = "0.5";
	var download = document.getElementById("download");
	var worker = null;
	var isStatic = false;

	var slider_scale = document.getElementById("slider_scale");

	slider_scale.addEventListener("input", function () {
		var thisValue = parseFloat(this.value);
		if (thisValue >= 0 && thisValue <= 8) {
			scale = thisValue;

		};
	}, false);

	fullScreen.onclick = () => {
		if (isFullScreen) {
			MaxS = window.innerHeight * 0.8
			canvas.width = MaxS;
			canvas.height = MaxS;
			isFullScreen = false;
			fullScreen.textContent = "go fullscreen";
		} else {
			MaxS = window.innerHeight;
			canvas.width = MaxS;
			canvas.height = MaxS;
			isFullScreen = true;
			fullScreen.textContent = "exit fullscreen";
			canvasContainer.scrollIntoView({behavior: "smooth", block: "start"})
		}

		start();
		if (playing) {
			// do nothing
		} else {
			setTimeout(() => {
				stop();
			}, 100)
		}
	}


	colorPickerSpan.onclick = () => {
		particleColor.click();
	}

	colorInput.onchange = () => {
		particleColor.value = colorInput.value;
		colorPickerSpan.style.backgroundColor = particleColor.value;
	}

	particleColor.oninput = () => {
		colorPickerSpan.style.backgroundColor = particleColor.value;
		colorInput.value = particleColor.value;
	}

	static.onclick = () => {
		static.style.borderColor = "#F15D22";
		motion.style.borderColor = null;
		isStatic = true;
	}

	motion.onclick = () => {
		motion.style.borderColor = "#F15D22";
		static.style.borderColor = null;
		isStatic = false;
	}

	document.addEventListener("keyup", e => {
		e.preventDefault();
		if (e.keyCode === 32 || e.key === ' ') {
			if (playing) {
				stop();

			} else {

				resume()
			}
		}
	})


	download.onclick = () => {

		// create download popup
		let downloadPrompt = document.createElement("div");
		let curParamsTitle = document.createElement("h5");
		curParamsTitle.textContent = "Download WITH current PARAMETERS: "
		let curParams = document.createElement("input");
		curParams.type = "checkbox";
		curParams.checked = true;
		let curParamsInput = createPopupInput(curParamsTitle, curParams)

		let initParamsTitle = document.createElement("h5");
		initParamsTitle.textContent = "Download WITH INITIAL PARAMETERS: "
		let initParams = document.createElement("input");
		initParams.type = "checkbox";
		
		let initParamsInput = createPopupInput(initParamsTitle, initParams)

		let transparencyTitle = document.createElement("h5");
		transparencyTitle.textContent = "DOWNLOAD Transparent: ";
		let transparencyCheck = document.createElement("input");
		transparencyCheck.type = "checkbox";
		let transparencyCheckInput = createPopupInput(transparencyTitle, transparencyCheck);

		let densityTitle = document.createElement("h5");
		densityTitle.textContent = "Density: ";
		let densitySelector = document.createElement("select");
		let densityLow = document.createElement("option");
		densityLow.value = "low";
		densityLow.textContent = "low"
		let densityMedium = document.createElement("option");
		densityMedium.value = "medium";
		densityMedium.textContent = "medium"
		densityMedium.selected = true;
		let densityMH = document.createElement("option");
		densityMH.value = "mediumhigh";
		densityMH.textContent = "Medium-high"
		let densityHigh = document.createElement("option");
		densityHigh.value = "high";
		densityHigh.textContent = "High"
		densitySelector.appendChild(densityLow);
		densitySelector.appendChild(densityMedium);
		densitySelector.appendChild(densityMH);
		densitySelector.appendChild(densityHigh);
		let densityInput = createPopupInput(densityTitle, densitySelector);

		// scale
		let sizeTitle = document.createElement("h5");
		sizeTitle.textContent = "scale: ";
		let sizeSelector = document.createElement("select");
		let sizeLow = document.createElement("option");
		sizeLow.value = "small";
		sizeLow.textContent = "small"
		let sizeMedium = document.createElement("option");
		sizeMedium.value = "regular";
		sizeMedium.textContent = "regular"
		sizeMedium.selected = true;
		let sizeHigh = document.createElement("option");
		sizeHigh.value = "large";
		sizeHigh.textContent = "large"
		sizeSelector.appendChild(sizeLow);
		sizeSelector.appendChild(sizeMedium);
		sizeSelector.appendChild(sizeHigh);
		let sizeInput = createPopupInput(sizeTitle, sizeSelector);

		// canvas size
		let canvasSizeTitle = document.createElement("h5");
		canvasSizeTitle.textContent = "size: ";
		let canvasSizeInputContainer = document.createElement("div");
		let canvasSizeWidthInput = document.createElement("input");
		canvasSizeWidthInput.style.marginRight = "10px";
		canvasSizeWidthInput.type = "number";
		canvasSizeWidthInput.value = 7680;
		let canvasSizeHieghtInput = document.createElement("input");
		canvasSizeHieghtInput.style.marginLeft = "10px";
		canvasSizeHieghtInput.type = "number";
		canvasSizeHieghtInput.value = 7680;
		let Xmark = document.createElement("span");
		Xmark.textContent = "x";
		canvasSizeInputContainer.appendChild(canvasSizeTitle);
		canvasSizeInputContainer.appendChild(canvasSizeWidthInput);
		canvasSizeInputContainer.appendChild(Xmark);
		canvasSizeInputContainer.appendChild(canvasSizeHieghtInput);
		canvasSizeInputContainer.style.display = "flex";
		let canvasSizeInput = createPopupInput(canvasSizeTitle, canvasSizeInputContainer);
		canvasSizeInput.style.flexDirection = "column";
		canvasSizeInput.style.alignItems = "flex-start";
		

		let buttonset = document.createElement('div');
		buttonset.classList.add("button-set")

		let startBtn = document.createElement('button');
		startBtn.textContent = "start";

		let isDownloading = false;
		startBtn.onclick = () => {

			if (isDownloading) {
				return;
			}

			isDownloading = true;
			cancelBtn.disabled = false;
			startBtn.disabled = true;

			const offscreen = document.createElement('canvas').transferControlToOffscreen();
			worker = new Worker('./worker.js');
			if (curParams.checked) {
				a.value = Number.parseFloat(cur_a.textContent);
				b.value = Number.parseFloat(cur_b.textContent);
				c.value = Number.parseFloat(cur_c.textContent);
				d.value = Number.parseFloat(cur_d.textContent);
			} else {
				a.value = input_a.value;
				b.value = input_b.value;
				c.value = input_c.value;
				d.value = input_d.value;
			}
			worker.postMessage({ canvas: offscreen, properties: [a.value, b.value, c.value, d.value, sizeSelector.value, hexToRgb(particleColor.value), transparencyCheck.checked, densitySelector.value, canvasSizeWidthInput.value, canvasSizeHieghtInput.value] }, [offscreen]);

			worker.onmessage = function (result) {
				progressBar.style.display = null
				switch (result.data.status) {
					case "preparing":
						statusText.textContent = "Preparing: " + Math.trunc(result.data.progress * 100) + "%";
						break;
					case "drawing":
						statusText.textContent = "Drawing: " + Math.trunc(result.data.progress * 100) + "%";
						break;
					case "converting":
						statusText.textContent = "Preparing to download..."
						break;
					case "complete":
						let url = URL.createObjectURL(result.data.blob);

						var dlink = document.createElement('a');
						dlink.href = url
						dlink.setAttribute("download", `PDJ_${canvasSizeWidthInput.value}x${canvasSizeWidthInput.value}_${densitySelector.value}_${sizeSelector.value}_${Number.parseFloat(a.value).toFixed(2)},${Number.parseFloat(b.value).toFixed(2)},${Number.parseFloat(c.value).toFixed(2)},${Number.parseFloat(d.value).toFixed(2)}.png`);
						dlink.dispatchEvent(new MouseEvent('click'));

						URL.revokeObjectURL(url);
						statusText.textContent = "Successfully download!"
						isDownloading = false;
						download.disabled = false;

						setTimeout(() => {
							progressBar.style.display = "none";
							cancelBtn.disabled = true;
							startBtn.disabled = false;
							worker.terminate();

							start();

							if (playing) {
								// let it be
							} else {
								setTimeout(() => {
									stop();
								}, 100)
							}
						}, 2000)
						break;
				}

			}
		}

		let cancelBtn = document.createElement("button");
		cancelBtn.disabled = true;
		cancelBtn.textContent = "cancel"
		cancelBtn.onclick = () => {
			if (isDownloading) {
				worker.terminate();

				progressBar.style.display = "none";

				isDownloading = false;
				startBtn.disabled = false;
				cancelBtn.disabled = true;
			}
		}

		// progress bar
		let progressBar = document.createElement("div");
		progressBar.id = "progress";
		progressBar.style.display = "none";
		let statusText = document.createElement("span");
		statusText.id = "progress-status";
		progressBar.appendChild(statusText);

		downloadPrompt.appendChild(curParamsInput);
		downloadPrompt.appendChild(initParamsInput);
		downloadPrompt.appendChild(transparencyCheckInput);
		downloadPrompt.appendChild(densityInput);
		downloadPrompt.appendChild(sizeInput);
		downloadPrompt.appendChild(canvasSizeInput);
		downloadPrompt.appendChild(startBtn);
		downloadPrompt.appendChild(cancelBtn);
		downloadPrompt.appendChild(progressBar);




		function createPopupInput(title, input) {
			let inputContainer = document.createElement("div");
			inputContainer.classList.add("input-container");
			inputContainer.appendChild(title);
			inputContainer.appendChild(input);

			return inputContainer;
		}

		let dialog = popup(downloadPrompt);

		dialog.outer.addEventListener("click", e => {
			if (dialog.el.contains(e.target)) {
				// do nothing
			} else {
				if (worker != null) {
					worker.terminate();
				}

				progressBar.style.opacity = "0";

				dialog.el.classList.remove("be-come");
				dialog.el.offsetLeft;
				dialog.el.classList.add("be-gone");
				setTimeout(() => {
					dialog.close();
					document.body.style.overflow = null;
				}, 300);

			}
		})

		document.body.style.overflow = "hidden";
	}

	window.addEventListener('resize', () => {
		if (isFullScreen) {
			fullScreen.textContent = "go fullscreen";
		}
		isFullScreen = false;

		let newSize = window.innerHeight * 0.8

		canvas.width = newSize;
		canvas.height = newSize;
		MaxS = newSize;

		start();
		if (playing) {
			// do nothing
		} else {
			setTimeout(() => {
				stop();
			}, 100)
		}

	})


	particleColor.value = defaultColor;
	setValues(1.4, -2.3, 2.4, -2.1, 4.5, 2);

	let playing = true;

	document.getElementById('redraw').addEventListener("click", function () {
		start();
		setValues(input_a.value, input_b.value, input_c.value, input_d.value, slider_scale.value, 2);

		playing = true;

	}, false);

	play.addEventListener("click", function () {
		pause.style.opacity = null
		if (!playing) {
			resume();
		} else {
			// do nothing
		}
	}, false);

	pause.addEventListener("click", function () {
		play.style.opacity = null
		if (playing) {
			stop();
		} else {
			// do nothing
		}
	}, false);

	slider_a.addEventListener("input", function () {
		var thisValue = parseFloat(this.value);
		if (thisValue >= -pi && thisValue <= pi) {
			input_a.value = thisValue;
			a.value = thisValue;

		};
	}, false);

	input_a.addEventListener("input", function () {
		var thisValue = parseFloat(this.value);
		if (thisValue >= -pi && thisValue <= pi) {
			a.value = thisValue;

			slider_a.value = thisValue;
		};
	}, false);

	slider_b.addEventListener("input", function () {
		var thisValue = parseFloat(this.value);
		if (thisValue >= -pi && thisValue <= pi) {
			input_b.value = thisValue;
			b.value = thisValue;

		};
	}, false);

	input_b.addEventListener("input", function () {
		var thisValue = parseFloat(this.value);
		if (thisValue >= -pi && thisValue <= pi) {
			b.value = thisValue;

			slider_b.value = thisValue;
		};
	}, false);

	slider_c.addEventListener("input", function () {
		var thisValue = parseFloat(this.value);
		if (thisValue >= -pi && thisValue <= pi) {
			input_c.value = thisValue;
			c.value = thisValue;

		};
	}, false);

	input_c.addEventListener("input", function () {
		var thisValue = parseFloat(this.value);
		if (thisValue >= -pi && thisValue <= pi) {
			c.value = thisValue;

			slider_c.value = thisValue;
		};
	}, false);

	slider_d.addEventListener("input", function () {
		var thisValue = parseFloat(this.value);
		if (thisValue >= -pi && thisValue <= pi) {
			input_d.value = thisValue;
			d.value = thisValue;

		};
	}, false);

	input_d.addEventListener("input", function () {
		var thisValue = parseFloat(this.value);
		if (thisValue >= -pi && thisValue <= pi) {
			d.value = thisValue;

			slider_d.value = thisValue;
		};
	}, false);


	function setValues(vala, valb, valc, vald, div, yMove) {
		function set(el, variable, value) {
			variable.value = value;
			el.value = value;
			if (el.type === "range") {
				el.value = value;
			}
		};

		set(slider_a, a, vala);
		set(slider_b, b, valb);
		set(slider_c, c, valc);
		set(slider_d, d, vald)
		set(input_a, a, vala);
		set(input_b, b, valb);
		set(input_c, c, valc);
		set(input_d, d, vald);
		scale = div;
		yPos = yMove;

		start();
	};

	function start() {
		if (requestFrame) {
			cancelAnimationFrame(requestFrame);
		}
		play.style.opacity = 0.5;
		pause.style.opacity = null;
		S = document.body.clientWidth - 100;
		if (S > MaxS) S = MaxS;
		canvas.width = S;
		canvas.height = S;
		x = y = 0;
		ctx.clearRect(0, 0, S, S);
		requestFrame = requestAnimationFrame(draw);
	};

	function stop() {
		play.style.opacity = null;
		pause.style.opacity = 0.5;
		playing = false;
		cancelAnimationFrame(requestFrame)
	}

	function resume() {
		play.style.opacity = 0.5;
		pause.style.opacity = null;
		playing = true;
		requestFrame = requestAnimationFrame(draw);
	}


	// animate the attractor
	let direction = 1;
	function animated(value) {

		if (value <= 3 && value >= -3) {
			return value = value + direction * 0.001
		} else {
			direction = -direction;
			return value = value + direction * 0.001;

		}

	}


	function draw() {

		if (isStatic) {
			// static image
		} else {
			ctx.fillStyle = "rgba(15, 15, 15, 0.1)";
			ctx.fillRect(0, 0, canvas.width, canvas.height)
		}
		ctx.save();
		ctx.fillStyle = "rgba(" + particleColor.value.match(/[A-Za-z0-9]{2}/g).map(function (v) { return parseInt(v, 16) }).join(",") + ", 0.1)";
		// ctx.strokeStyle = particleColor.value;

		ctx.globalAlpha = ga.value;

		if (isStatic) {
			// static image
		} else {
			// draw i numbers of particles per second
			let new_a = Number.parseFloat(animated(a.value));
			let new_b = Number.parseFloat(animated(b.value));
			let new_c = Number.parseFloat(animated(c.value));
			let new_d = Number.parseFloat(animated(d.value));

			cur_a.textContent = new_a.toFixed(3);
			cur_b.textContent = new_b.toFixed(3);
			cur_c.textContent = new_c.toFixed(3);
			cur_d.textContent = new_d.toFixed(3);

			a.value = new_a;
			b.value = new_b;
			c.value = new_c;
			d.value = new_d;
		}

		for (i = 50000; i--;) {
			xp = x;

			x = Math.sin(a.value * y) - Math.cos(b.value * xp);
			y = Math.sin(c.value * xp) - Math.cos(d.value * y);
			ctx.fillRect(Math.trunc(x * S / scale + S / 2), Math.trunc(y * S / scale + S / yPos), pS.value, pS.value);

		}
		ctx.restore();
		requestFrame = requestAnimationFrame(draw);
	};

});

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? [
		parseInt(result[1], 16),
		parseInt(result[2], 16),
		parseInt(result[3], 16)
	] : null;
}


function popup(attributes) {
	let popupEl = document.createElement("div");
	popupEl.classList.add("popup");
	let outer = document.body.appendChild(popupEl);
	let popupCt = document.createElement("div");
	popupCt.appendChild(attributes);
	let inner = outer.appendChild(popupCt);
	inner.classList.add("be-come")

	function close() {
		outer.remove();
	}

	return {
		el: inner,
		outer: outer,
		close: close
	}
}