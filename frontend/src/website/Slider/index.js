import React from 'react';
import './Slider.css';

const Slider = () => {
	return (
		<div className="slider1">
			<ul className="slides">
				<input type="radio" name="radio-btn" id="img-1" checked />
				<li className="slide-container">
					<div className="slide">
						<img src="http://farm9.staticflickr.com/8072/8346734966_f9cd7d0941_z.jpg" alt="trimmer" />
					</div>
					<div className="nav">
						<label for="img-6" className="prev">
							&#x2039;
						</label>
						<label for="img-2" className="next">
							&#x203a;
						</label>
					</div>
				</li>

				<input type="radio" name="radio-btn" id="img-2" />
				<li className="slide-container">
					<div className="slide">
						<img src="http://farm9.staticflickr.com/8504/8365873811_d32571df3d_z.jpg" alt="shaver" />
					</div>
					<div className="nav">
						<label for="img-1" className="prev">
							&#x2039;
						</label>
						<label for="img-3" className="next">
							&#x203a;
						</label>
					</div>
				</li>

				{/* <input type="radio" name="radio-btn" id="img-3" />
				<li className="slide-container">
					<div className="slide">
						<img src="http://farm9.staticflickr.com/8068/8250438572_d1a5917072_z.jpg" />
					</div>
					 <div className="nav">
						<label for="img-2" className="prev">
							&#x2039;
						</label>
						<label for="img-4" className="next">
							&#x203a;
						</label>
					</div>
				</li>

				 <input type="radio" name="radio-btn" id="img-4" />
				<li className="slide-container">
					<div className="slide">
						<img src="http://farm9.staticflickr.com/8061/8237246833_54d8fa37f0_z.jpg" />
					</div>
					 <div className="nav">
						<label for="img-3" className="prev">
							&#x2039;
						</label>
						<label for="img-5" className="next">
							&#x203a;
						</label>
					</div>
				</li>

				<input type="radio" name="radio-btn" id="img-5" />
				<li className="slide-container">
					<div className="slide">
						<img src="http://farm9.staticflickr.com/8055/8098750623_66292a35c0_z.jpg" />
					</div>
					 <div className="nav">
						<label for="img-4" className="prev">
							&#x2039;
						</label>
						<label for="img-6" className="next">
							&#x203a;
						</label>
					</div>
				</li>

				<input type="radio" name="radio-btn" id="img-6" />
				<li className="slide-container">
					<div className="slide">
						<img src="http://farm9.staticflickr.com/8195/8098750703_797e102da2_z.jpg" />
					</div>
					<div className="nav">
						<label for="img-5" className="prev">
							&#x2039;
						</label>
						<label for="img-1" className="next">
							&#x203a;
						</label>
					</div>
				</li> */}

				<li className="nav-dots">
					<label for="img-1" className="nav-dot" id="img-dot-1" />
					<label for="img-2" className="nav-dot" id="img-dot-2" />
					{/* <label for="img-3" className="nav-dot" id="img-dot-3" />
					<label for="img-4" className="nav-dot" id="img-dot-4" />
					<label for="img-5" className="nav-dot" id="img-dot-5" />
					<label for="img-6" className="nav-dot" id="img-dot-6" /> */}
				</li>
			</ul>
		</div>
	);
};

export default Slider;
