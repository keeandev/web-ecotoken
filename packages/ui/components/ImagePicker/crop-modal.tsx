import {
	type SetStateAction,
	useCallback,
	useState,
	type Dispatch,
	useRef,
	Fragment
} from "react";
import Cropper, { Area } from "react-easy-crop";
import { Dialog, Transition } from "@headlessui/react";
import Button from "../Button";
import { CardTitle } from "../Card";
import { cropImage } from "./crop-image";

type ImageCropModalProps = {
	image?: string;
	isOpen?: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	setImage?: Dispatch<SetStateAction<string | undefined>>;
	aspect?: number;
	showGrid?: boolean;
};

export const CropImageModal: React.FC<ImageCropModalProps> = ({
	image,
	setIsOpen,
	setImage,
	isOpen = true,
	aspect = 1,
	showGrid = false
}) => {
	const finishButtonRef = useRef<HTMLButtonElement | null>(null);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
		null
	);

	const onCropComplete = useCallback(
		async (croppedArea: Area, croppedAreaPixels: Area) => {
			setCroppedAreaPixels(croppedAreaPixels);
		},
		[]
	);

	return (
		<Transition show={isOpen} as={Fragment}>
			<Dialog
				initialFocus={finishButtonRef}
				onClose={() => setIsOpen(false)}
				className="relative z-50"
			>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div
						className="fixed inset-0 bg-black/30"
						aria-hidden="true"
					/>
				</Transition.Child>
				<Transition.Child
					as={Fragment}
					enter="ease-out transition duration-100"
					enterFrom="transform scale-95 opacity-0"
					enterTo="transform scale-100 opacity-100"
					leave="ease-in transition duration-75"
					leaveFrom="transform scale-100 opacity-100"
					leaveTo="transform scale-95 opacity-0"
				>
					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4">
							<Dialog.Panel className="mx-auto w-full max-w-md overflow-hidden rounded-md border border-slate-400 bg-slate-100">
								{/* <Dialog.Title>Crop Image</Dialog.Title> */}
								<CardTitle className="mx-4 mt-4 text-slate-400">
									Crop Image
								</CardTitle>
								<div className="relative h-96 w-full overflow-hidden">
									<Cropper
										classes={{
											containerClassName:
												"bg-slate-300 m-4 rounded-md",
											mediaClassName: "transition-none"
										}}
										image={image}
										crop={crop}
										zoom={zoom}
										aspect={aspect}
										onCropChange={setCrop}
										onCropComplete={onCropComplete}
										onZoomChange={setZoom}
										showGrid={showGrid}
										objectFit="contain"
										onMediaLoaded={() =>
											setCrop({
												x: 0,
												y: 0
											})
										}
									/>
								</div>
								<div className="flex bg-slate-200 p-4">
									<Button intent="tertiary-no-underline">
										Skip
									</Button>
									<div className="flex flex-1 justify-end space-x-2">
										<Button
											intent="secondary"
											onClick={() => setIsOpen(false)}
										>
											Cancel
										</Button>
										<Button
											ref={finishButtonRef}
											onClick={async () => {
												if (!setImage) return;
												if (
													image &&
													croppedAreaPixels
												) {
													const croppedImage =
														await cropImage(
															image,
															croppedAreaPixels
														);
													if (
														croppedImage instanceof
														Error
													)
														console.error(
															croppedImage
														);
													else setImage(croppedImage);
												}
												setIsOpen(false);
											}}
										>
											Finish
										</Button>
									</div>
								</div>
							</Dialog.Panel>
						</div>
					</div>
				</Transition.Child>
			</Dialog>
		</Transition>
	);
};

export default CropImageModal;
