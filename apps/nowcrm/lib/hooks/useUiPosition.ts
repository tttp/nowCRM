"use client";

import type React from "react";
import { useEffect, useState } from "react";

export function useElementPosition(
	ref: React.RefObject<HTMLElement>,
	dropdownHeight: number,
	isOpen: boolean,
) {
	const [position, setPosition] = useState<{
		shouldOpenUpward: boolean;
		availableSpaceBelow: number;
		availableSpaceAbove: number;
	}>({
		shouldOpenUpward: false,
		availableSpaceBelow: 0,
		availableSpaceAbove: 0,
	});

	useEffect(() => {
		if (!isOpen) return; // Only calculate when dropdown is open

		const calculatePosition = () => {
			if (!ref.current) return;

			const rect = ref.current.getBoundingClientRect();
			const availableSpaceBelow = window.innerHeight - rect.bottom;
			const availableSpaceAbove = rect.top;

			const shouldOpenUpward =
				availableSpaceBelow < dropdownHeight &&
				availableSpaceAbove > availableSpaceBelow;

			setPosition({
				shouldOpenUpward,
				availableSpaceBelow,
				availableSpaceAbove,
			});
		};

		calculatePosition();
		window.addEventListener("scroll", calculatePosition);
		window.addEventListener("resize", calculatePosition);

		return () => {
			window.removeEventListener("scroll", calculatePosition);
			window.removeEventListener("resize", calculatePosition);
		};
	}, [ref, dropdownHeight, isOpen]);

	return position;
}
