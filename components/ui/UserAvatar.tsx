import Image from "next/image";
import React from "react";

interface UserAvatarProps {
  image?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
}

function getInitials(name?: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function stringToColor(str: string) {
  // Simple hash to color
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 60%)`;
  return color;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ image, name, size = 40, className = "" }) => {
  if (image) {
    return (
      <Image
        src={image}
        alt={name ? `${name}'s profile picture` : "User avatar"}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
        loading="lazy"
      />
    );
  }
  const initials = getInitials(name);
  const bgColor = stringToColor(name || "?");
  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white select-none ${className}`}
      style={{ width: size, height: size, background: bgColor, fontSize: size * 0.45 }}
      aria-label={name ? `${name} avatar` : "User avatar"}
    >
      {initials}
    </div>
  );
};

export default UserAvatar; 