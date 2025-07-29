"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { VercelTabs } from "@/components/ui/vercel-tabs"
import { Button } from "@/components/ui/button"
import { CreateButton } from "@/components/create-button"
import { ShadcnDataTable } from "@/components/ui/shadcn-data-table"
import { StatusBadge } from "@/components/status-badge"
import { VolumeDeletionStatus } from "@/components/volume-deletion-status"
import { ActionMenu } from "@/components/action-menu"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { ExtendVolumeModal } from "@/components/modals/extend-volume-modal"
import { AttachedVolumeAlert, DeleteVolumeConfirmation } from "@/components/modals/delete-volume-modals"
import { DeleteSnapshotConstraintModal, DeleteSnapshotConfirmationModal } from "@/components/modals/delete-snapshot-modals"
import { useToast } from "@/hooks/use-toast"
import { filterDataForUser, shouldShowEmptyState, getEmptyStateMessage } from "@/lib/demo-data-filter"
import { canDeletePrimarySnapshot, getPrimarySnapshotsForResource } from "@/lib/data"
import { EmptyState } from "@/components/ui/empty-state"
import { snapshots } from "@/lib/data"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { CreateBackupModal } from "@/components/modals/create-backup-modal"
import { CreateSnapshotModal } from "@/components/modals/create-snapshot-modal"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const volumeIcon = (
  <svg width="467" height="218" viewBox="0 0 467 218" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-72">
    <g opacity="0.51">
      <path d="M82.7402 46.25C189.21 80.88 308.48 120.21 414.66 155.72C308.19 121.09 188.92 81.76 82.7402 46.25Z" fill="#686767"/>
      <path d="M163.42 11.02L174.86 14.6299L174.83 14.74L163.42 11.02Z" fill="#686767"/>
      <path d="M186.31 18.25L197.75 21.8601L197.65 22.1699L186.24 18.46L186.31 18.25Z" fill="#686767"/>
      <path d="M209.19 25.49L220.62 29.1299L220.49 29.55L209.07 25.8701L209.19 25.49Z" fill="#686767"/>
      <path d="M232.05 32.78L243.49 36.4199L243.33 36.9099L231.91 33.23L232.05 32.78Z" fill="#686767"/>
      <path d="M254.92 40.0701L266.35 43.71L266.17 44.27L254.75 40.5901L254.92 40.0701Z" fill="#686767"/>
      <path d="M277.79 47.3601L289.219 51L289.02 51.6399L277.6 47.95L277.79 47.3601Z" fill="#686767"/>
      <path d="M300.649 54.6499L312.09 58.29L311.86 59L300.439 55.3201L300.649 54.6499Z" fill="#686767"/>
      <path d="M323.51 61.97L334.93 65.6499L334.72 66.3L323.29 62.6499L323.51 61.97Z" fill="#686767"/>
      <path d="M346.35 69.3301L357.77 73.01L357.59 73.5901L346.16 69.9399L346.35 69.3301Z" fill="#686767"/>
      <path d="M369.199 76.6899L380.62 80.3701L380.449 80.8799L369.02 77.23L369.199 76.6899Z" fill="#686767"/>
      <path d="M392.04 84.05L403.46 87.74L403.32 88.1699L391.89 84.52L392.04 84.05Z" fill="#686767"/>
      <path d="M414.88 91.4199L426.3 95.1001L426.19 95.46L414.75 91.8101L414.88 91.4199Z" fill="#686767"/>
      <path d="M437.71 98.8101L449.12 102.53L449.07 102.68L437.63 99.0701L437.71 98.8101Z" fill="#686767"/>
      <path d="M460.53 106.24L466.36 108.14L460.52 106.3L460.53 106.24Z" fill="#686767"/>
      <path d="M5.0498 89.3201L12.6798 91.72C12.6798 91.72 12.7097 91.74 12.6997 91.76C12.6997 91.78 12.6798 91.79 12.6598 91.78L5.0498 89.3201Z" fill="#686767"/>
      <path d="M20.3196 94.1201L27.9496 96.52C27.9496 96.52 28.0296 96.5898 28.0096 96.6398C27.9896 96.6898 27.9396 96.7199 27.8896 96.6999L20.2796 94.2399C20.2796 94.2399 20.2296 94.1898 20.2396 94.1598C20.2496 94.1298 20.2896 94.1101 20.3196 94.1201Z" fill="#686767"/>
      <path d="M35.5801 98.9199L43.2101 101.32C43.2901 101.35 43.3402 101.43 43.3102 101.52C43.2802 101.6 43.2001 101.65 43.1101 101.62L35.5001 99.1599C35.4301 99.1399 35.4001 99.07 35.4201 99C35.4401 98.93 35.5101 98.8999 35.5801 98.9199Z" fill="#686767"/>
      <path d="M50.8402 103.72L58.4702 106.14C58.5702 106.17 58.6302 106.29 58.6002 106.39C58.5702 106.49 58.4602 106.55 58.3502 106.52L50.7302 104.08C50.6302 104.05 50.5802 103.94 50.6102 103.84C50.6402 103.74 50.7502 103.69 50.8502 103.72H50.8402Z" fill="#686767"/>
      <path d="M66.0902 108.56L73.7202 110.98C73.8402 111.02 73.9002 111.14 73.8602 111.26C73.8202 111.38 73.7002 111.44 73.5802 111.4L65.9602 108.96C65.8502 108.92 65.7902 108.81 65.8202 108.7C65.8602 108.59 65.9702 108.53 66.0802 108.56H66.0902Z" fill="#686767"/>
      <path d="M81.34 113.4L88.97 115.82C89.1 115.86 89.1701 116 89.1301 116.12C89.0901 116.24 88.95 116.32 88.83 116.28L81.21 113.84C81.09 113.8 81.0201 113.67 81.0601 113.55C81.1001 113.43 81.2301 113.36 81.3501 113.4H81.34Z" fill="#686767"/>
      <path d="M96.5896 118.24L104.22 120.66C104.36 120.7 104.44 120.85 104.39 120.99C104.35 121.13 104.2 121.2 104.06 121.16L96.4396 118.72C96.3096 118.68 96.2297 118.54 96.2797 118.4C96.3197 118.27 96.4597 118.19 96.5997 118.24H96.5896Z" fill="#686767"/>
      <path d="M111.85 123.08L119.48 125.5C119.63 125.55 119.71 125.71 119.67 125.86C119.62 126.01 119.46 126.09 119.31 126.05L111.69 123.61C111.55 123.56 111.47 123.41 111.51 123.27C111.55 123.13 111.71 123.05 111.85 123.09V123.08Z" fill="#686767"/>
      <path d="M127.099 127.92L134.729 130.34C134.889 130.39 134.979 130.56 134.929 130.72C134.879 130.88 134.709 130.97 134.549 130.92L126.929 128.48C126.769 128.43 126.689 128.26 126.739 128.11C126.789 127.96 126.959 127.87 127.109 127.92H127.099Z" fill="#686767"/>
      <path d="M142.349 132.75L149.979 135.17C150.149 135.23 150.249 135.41 150.189 135.58C150.139 135.75 149.949 135.85 149.779 135.79L142.159 133.35C141.989 133.3 141.899 133.12 141.949 132.95C141.999 132.78 142.179 132.69 142.349 132.74V132.75Z" fill="#686767"/>
      <path d="M157.599 137.59L165.229 140.01C165.409 140.07 165.519 140.26 165.459 140.45C165.399 140.63 165.21 140.74 165.02 140.68L157.4 138.24C157.22 138.18 157.12 137.99 157.18 137.81C157.24 137.63 157.429 137.53 157.599 137.59Z" fill="#686767"/>
      <path d="M172.85 142.43L180.48 144.85C180.68 144.91 180.78 145.12 180.72 145.32C180.66 145.51 180.45 145.62 180.25 145.56L172.63 143.12C172.44 143.06 172.34 142.86 172.4 142.67C172.46 142.48 172.66 142.38 172.85 142.44V142.43Z" fill="#686767"/>
      <path d="M188.09 147.28L195.71 149.72C195.9 149.78 196 149.98 195.94 150.17C195.88 150.36 195.68 150.46 195.49 150.4L187.86 147.98C187.67 147.92 187.56 147.71 187.62 147.52C187.68 147.33 187.89 147.22 188.08 147.28H188.09Z" fill="#686767"/>
      <path d="M203.33 152.16L210.95 154.6C211.13 154.66 211.22 154.85 211.17 155.02C211.12 155.19 210.93 155.29 210.75 155.24L203.12 152.82C202.94 152.76 202.84 152.57 202.89 152.38C202.95 152.2 203.14 152.1 203.33 152.15V152.16Z" fill="#686767"/>
      <path d="M218.57 157.04L226.19 159.48C226.36 159.53 226.45 159.71 226.39 159.88C226.34 160.05 226.16 160.14 226 160.08L218.37 157.66C218.2 157.61 218.1 157.42 218.16 157.25C218.21 157.08 218.4 156.98 218.57 157.04Z" fill="#686767"/>
      <path d="M233.81 161.92L241.43 164.36C241.58 164.41 241.67 164.57 241.62 164.73C241.57 164.88 241.41 164.97 241.25 164.92L233.62 162.5C233.46 162.45 233.37 162.28 233.42 162.12C233.47 161.96 233.64 161.87 233.8 161.92H233.81Z" fill="#686767"/>
      <path d="M249.05 166.81L256.669 169.25C256.809 169.3 256.89 169.45 256.85 169.59C256.8 169.73 256.65 169.81 256.51 169.77L248.879 167.35C248.729 167.3 248.649 167.14 248.699 167C248.749 166.85 248.91 166.77 249.05 166.82V166.81Z" fill="#686767"/>
      <path d="M264.28 171.69L271.9 174.13C272.03 174.17 272.1 174.31 272.06 174.44C272.02 174.57 271.88 174.64 271.75 174.6L264.12 172.18C263.98 172.14 263.91 171.99 263.95 171.85C263.99 171.71 264.14 171.64 264.28 171.68V171.69Z" fill="#686767"/>
      <path d="M279.52 176.57L287.14 179.01C287.26 179.05 287.33 179.18 287.29 179.3C287.25 179.42 287.12 179.49 287 179.45L279.37 177.03C279.24 176.99 279.18 176.86 279.21 176.73C279.25 176.6 279.38 176.54 279.51 176.57H279.52Z" fill="#686767"/>
      <path d="M294.76 181.45L302.38 183.89C302.49 183.92 302.55 184.04 302.51 184.15C302.48 184.26 302.36 184.32 302.25 184.28L294.62 181.86C294.51 181.82 294.44 181.7 294.48 181.59C294.52 181.48 294.64 181.41 294.75 181.45H294.76Z" fill="#686767"/>
      <path d="M310 186.33L317.62 188.78C317.71 188.81 317.76 188.91 317.73 189C317.7 189.09 317.6 189.15 317.51 189.11L309.88 186.7C309.78 186.67 309.72 186.56 309.75 186.46C309.78 186.36 309.89 186.3 309.99 186.33H310Z" fill="#686767"/>
      <path d="M325.219 191.23L332.83 193.69C332.89 193.71 332.919 193.77 332.899 193.83C332.879 193.89 332.82 193.92 332.76 193.9L325.129 191.5C325.049 191.48 325.01 191.39 325.03 191.32C325.05 191.24 325.139 191.2 325.209 191.22L325.219 191.23Z" fill="#686767"/>
      <path d="M340.449 196.15L348.059 198.61C348.059 198.61 348.099 198.65 348.089 198.67C348.089 198.7 348.049 198.71 348.029 198.7L340.399 196.3C340.399 196.3 340.329 196.24 340.349 196.2C340.359 196.16 340.409 196.13 340.449 196.15Z" fill="#686767"/>
      <path d="M355.67 201.07L360.48 202.63L355.65 201.11C355.65 201.11 355.63 201.1 355.64 201.09C355.64 201.08 355.65 201.07 355.66 201.08L355.67 201.07Z" fill="#686767"/>
      <g opacity="0.61">
        <path d="M437.51 75.27L434.11 77.3799C434.11 77.3799 434.09 77.3799 434.08 77.3799C434.08 77.3699 434.08 77.3601 434.08 77.3501L437.5 75.27H437.51Z" fill="#686767"/>
        <path d="M427.32 81.6101L420.52 85.8401C420.47 85.8701 420.4 85.86 420.37 85.81C420.34 85.76 420.35 85.6899 420.4 85.6599L427.24 81.5C427.27 81.48 427.31 81.5 427.33 81.52C427.35 81.55 427.33 81.5901 427.31 81.6101H427.32Z" fill="#686767"/>
        <path d="M413.72 90.0602L406.92 94.2801C406.83 94.3401 406.71 94.3101 406.66 94.2201C406.6 94.1301 406.63 94.0101 406.72 93.9601L413.56 89.8002C413.63 89.7602 413.72 89.7802 413.77 89.8502C413.81 89.9202 413.79 90.0102 413.72 90.0602Z" fill="#686767"/>
        <path d="M400.111 98.49L393.301 102.69C393.201 102.75 393.06 102.72 393 102.62C392.94 102.52 392.971 102.38 393.071 102.32L399.9 98.1399C400 98.0799 400.12 98.11 400.18 98.21C400.24 98.31 400.211 98.43 400.111 98.49Z" fill="#686767"/>
        <path d="M386.48 106.9L379.67 111.1C379.55 111.17 379.4 111.14 379.33 111.02C379.26 110.9 379.29 110.75 379.41 110.68L386.24 106.5C386.35 106.43 386.49 106.47 386.56 106.58C386.63 106.69 386.59 106.83 386.48 106.9Z" fill="#686767"/>
        <path d="M372.85 115.31L366.04 119.51C365.91 119.59 365.74 119.55 365.66 119.42C365.58 119.29 365.62 119.12 365.75 119.04L372.58 114.86C372.7 114.78 372.87 114.82 372.94 114.95C373.02 115.07 372.98 115.24 372.85 115.31Z" fill="#686767"/>
        <path d="M359.23 123.72L352.42 127.92C352.28 128.01 352.09 127.96 352 127.82C351.91 127.68 351.96 127.49 352.1 127.4L358.93 123.22C359.07 123.14 359.25 123.18 359.33 123.32C359.41 123.46 359.37 123.64 359.23 123.72Z" fill="#686767"/>
        <path d="M345.601 132.12L338.791 136.32C338.631 136.42 338.421 136.37 338.331 136.21C338.231 136.05 338.281 135.84 338.441 135.75L345.271 131.57C345.421 131.48 345.621 131.52 345.711 131.68C345.801 131.83 345.761 132.03 345.601 132.12Z" fill="#686767"/>
        <path d="M331.971 140.53L325.161 144.73C324.991 144.84 324.761 144.78 324.661 144.61C324.561 144.44 324.611 144.21 324.781 144.11L331.611 139.93C331.781 139.83 331.991 139.88 332.091 140.05C332.191 140.22 332.141 140.43 331.971 140.53Z" fill="#686767"/>
        <path d="M318.34 148.93L311.51 153.11C311.34 153.21 311.13 153.16 311.02 152.99C310.92 152.82 310.97 152.61 311.14 152.51L317.95 148.31C318.12 148.2 318.35 148.26 318.46 148.43C318.57 148.6 318.51 148.83 318.34 148.94V148.93Z" fill="#686767"/>
        <path d="M304.681 157.29L297.851 161.47C297.701 161.56 297.501 161.52 297.401 161.36C297.311 161.21 297.351 161.01 297.511 160.92L304.321 156.72C304.481 156.62 304.691 156.67 304.791 156.83C304.891 156.99 304.841 157.2 304.681 157.3V157.29Z" fill="#686767"/>
        <path d="M291.031 165.64L284.2 169.82C284.06 169.9 283.881 169.86 283.801 169.72C283.721 169.58 283.76 169.4 283.9 169.32L290.71 165.12C290.86 165.03 291.05 165.08 291.14 165.22C291.23 165.36 291.181 165.56 291.041 165.64H291.031Z" fill="#686767"/>
        <path d="M277.37 174L270.54 178.18C270.42 178.26 270.25 178.22 270.18 178.09C270.11 177.96 270.14 177.8 270.27 177.73L277.08 173.53C277.21 173.45 277.38 173.49 277.46 173.62C277.54 173.75 277.5 173.92 277.37 174Z" fill="#686767"/>
        <path d="M263.71 182.36L256.88 186.54C256.77 186.61 256.63 186.57 256.56 186.46C256.49 186.35 256.53 186.21 256.64 186.14L263.45 181.94C263.57 181.87 263.72 181.9 263.79 182.02C263.86 182.14 263.83 182.29 263.71 182.36Z" fill="#686767"/>
        <path d="M250.05 190.72L243.22 194.9C243.12 194.96 243 194.93 242.94 194.83C242.88 194.73 242.91 194.61 243.01 194.55L249.82 190.35C249.92 190.29 250.06 190.32 250.12 190.42C250.18 190.52 250.15 190.66 250.05 190.72Z" fill="#686767"/>
        <path d="M236.4 199.07L229.56 203.23C229.49 203.27 229.401 203.25 229.351 203.18C229.311 203.11 229.33 203.02 229.4 202.97L236.2 198.75C236.29 198.69 236.41 198.72 236.46 198.81C236.52 198.9 236.49 199.02 236.4 199.07Z" fill="#686767"/>
        <path d="M222.71 207.39L215.87 211.54C215.87 211.54 215.8 211.54 215.78 211.52C215.76 211.49 215.78 211.45 215.8 211.43L222.6 207.2C222.65 207.17 222.72 207.18 222.75 207.23C222.78 207.28 222.77 207.35 222.72 207.38L222.71 207.39Z" fill="#686767"/>
        <path d="M209.03 215.69L205.61 217.77L209.01 215.66C209.01 215.66 209.03 215.66 209.04 215.66C209.05 215.66 209.04 215.68 209.04 215.69H209.03Z" fill="#686767"/>
      </g>
      <path d="M373.4 50.2L369.95 52.22C369.95 52.22 369.93 52.22 369.92 52.22C369.92 52.22 369.92 52.1999 369.92 52.1899L373.39 50.2H373.4Z" fill="#686767"/>
      <path d="M362.909 56.3501L355.869 60.47C355.819 60.5 355.749 60.4799 355.719 60.4299C355.689 60.3799 355.709 60.31 355.759 60.28L362.839 56.23C362.869 56.21 362.909 56.23 362.929 56.25C362.949 56.28 362.929 56.3201 362.909 56.3401V56.3501Z" fill="#686767"/>
      <path d="M348.83 64.6001L341.79 68.72C341.7 68.77 341.58 68.7399 341.53 68.6499C341.48 68.5599 341.51 68.4399 341.6 68.3899L348.68 64.3301C348.75 64.2901 348.84 64.3099 348.88 64.3899C348.92 64.4599 348.9 64.5501 348.83 64.5901V64.6001Z" fill="#686767"/>
      <path d="M334.74 72.82L327.69 76.9199C327.59 76.9799 327.45 76.95 327.39 76.84C327.33 76.74 327.36 76.6 327.47 76.54L334.54 72.4599C334.64 72.3999 334.76 72.44 334.82 72.53C334.88 72.62 334.84 72.75 334.75 72.81L334.74 72.82Z" fill="#686767"/>
      <path d="M320.639 81.03L313.589 85.1299C313.469 85.1999 313.319 85.1601 313.249 85.0401C313.179 84.9201 313.219 84.77 313.339 84.7L320.409 80.6201C320.519 80.5601 320.659 80.59 320.729 80.71C320.789 80.82 320.759 80.96 320.649 81.03H320.639Z" fill="#686767"/>
      <path d="M306.53 89.2299L299.48 93.33C299.35 93.41 299.18 93.3599 299.1 93.2299C299.02 93.0999 299.07 92.93 299.2 92.85L306.27 88.7699C306.4 88.6999 306.56 88.74 306.63 88.87C306.7 89 306.66 89.1599 306.53 89.2299Z" fill="#686767"/>
      <path d="M292.43 97.43L285.38 101.53C285.23 101.62 285.04 101.57 284.96 101.42C284.88 101.27 284.92 101.08 285.07 101L292.14 96.92C292.28 96.84 292.46 96.8901 292.54 97.0301C292.62 97.1701 292.57 97.35 292.43 97.43Z" fill="#686767"/>
      <path d="M278.32 105.63L271.27 109.73C271.11 109.82 270.9 109.77 270.81 109.61C270.72 109.45 270.77 109.24 270.93 109.15L278 105.07C278.15 104.98 278.35 105.03 278.44 105.19C278.53 105.34 278.48 105.54 278.32 105.63Z" fill="#686767"/>
      <path d="M264.22 113.83L257.17 117.93C256.99 118.03 256.77 117.97 256.67 117.8C256.57 117.62 256.63 117.4 256.8 117.3L263.87 113.22C264.04 113.12 264.25 113.18 264.35 113.35C264.45 113.52 264.39 113.73 264.22 113.83Z" fill="#686767"/>
      <path d="M250.11 122.03L243.04 126.11C242.87 126.21 242.65 126.15 242.56 125.98C242.46 125.81 242.52 125.6 242.69 125.5L249.74 121.4C249.92 121.3 250.14 121.36 250.24 121.53C250.34 121.7 250.28 121.93 250.11 122.03Z" fill="#686767"/>
      <path d="M235.969 130.18L228.899 134.26C228.739 134.35 228.549 134.3 228.459 134.14C228.369 133.99 228.42 133.79 228.58 133.7L235.629 129.6C235.789 129.51 236 129.56 236.09 129.72C236.18 129.88 236.129 130.09 235.969 130.18Z" fill="#686767"/>
      <path d="M221.84 138.33L214.77 142.41C214.63 142.49 214.45 142.44 214.37 142.3C214.29 142.16 214.34 141.98 214.48 141.9L221.53 137.8C221.68 137.71 221.87 137.76 221.95 137.91C222.03 138.06 221.99 138.25 221.84 138.33Z" fill="#686767"/>
      <path d="M207.71 146.48L200.64 150.56C200.51 150.63 200.35 150.59 200.28 150.46C200.21 150.33 200.25 150.17 200.38 150.1L207.43 146C207.56 145.92 207.73 145.97 207.81 146.1C207.89 146.23 207.84 146.4 207.71 146.48Z" fill="#686767"/>
      <path d="M193.569 154.63L186.499 158.71C186.389 158.77 186.239 158.74 186.179 158.62C186.119 158.51 186.149 158.37 186.269 158.3L193.319 154.2C193.439 154.13 193.589 154.17 193.659 154.29C193.729 154.41 193.689 154.56 193.569 154.63Z" fill="#686767"/>
      <path d="M179.44 162.78L172.37 166.86C172.27 166.92 172.15 166.88 172.09 166.78C172.03 166.68 172.07 166.56 172.16 166.5L179.21 162.4C179.31 162.34 179.45 162.37 179.51 162.48C179.57 162.58 179.54 162.72 179.43 162.78H179.44Z" fill="#686767"/>
      <path d="M165.3 170.93L158.22 174.98C158.15 175.02 158.06 175 158.01 174.92C157.97 174.85 157.99 174.76 158.06 174.71L165.1 170.59C165.19 170.54 165.31 170.57 165.36 170.66C165.41 170.75 165.38 170.87 165.29 170.92L165.3 170.93Z" fill="#686767"/>
      <path d="M151.139 179.03L144.059 183.08C144.059 183.08 143.989 183.08 143.969 183.06C143.949 183.03 143.969 182.99 143.989 182.97L151.029 178.84C151.079 178.81 151.149 178.83 151.179 178.88C151.209 178.93 151.189 179 151.139 179.03Z" fill="#686767"/>
      <path d="M136.98 187.14L133.51 189.13L136.96 187.11C136.96 187.11 136.98 187.11 136.99 187.11C136.99 187.12 136.99 187.13 136.99 187.14H136.98Z" fill="#686767"/>
      <path d="M309.29 25.1399C231.69 68.9399 144.4 117.63 66.3496 160.62C143.94 116.82 231.24 68.1399 309.29 25.1399Z" fill="#686767"/>
      <path d="M245.18 0.0700684L241.69 2.02002C241.69 2.02002 241.67 2.02002 241.66 2.02002C241.65 2.02002 241.66 1.99999 241.66 1.98999L245.17 0.0700684H245.18Z" fill="#686767"/>
      <path d="M234.51 6.03002L227.34 10.04C227.29 10.07 227.22 10.05 227.19 9.99999C227.16 9.94999 227.18 9.88009 227.23 9.85009L234.44 5.91991C234.47 5.89991 234.51 5.91994 234.53 5.94994C234.55 5.97994 234.53 6.02003 234.51 6.04003V6.03002Z" fill="#686767"/>
      <path d="M220.18 14.0401L213.01 18.0401C212.92 18.0901 212.8 18.0601 212.75 17.9701C212.7 17.8801 212.73 17.76 212.82 17.71L220.03 13.7701C220.1 13.7301 220.19 13.7602 220.23 13.8302C220.27 13.9002 220.24 13.9901 220.17 14.0301L220.18 14.0401Z" fill="#686767"/>
      <path d="M205.82 22.0301L198.64 26.0101C198.53 26.0701 198.4 26.03 198.34 25.93C198.28 25.82 198.32 25.6899 198.43 25.6299L205.63 21.67C205.73 21.62 205.85 21.6501 205.91 21.7501C205.96 21.8501 205.93 21.9701 205.83 22.0301H205.82Z" fill="#686767"/>
      <path d="M191.46 29.9901L184.28 33.97C184.16 34.04 184.01 33.9902 183.94 33.8702C183.87 33.7502 183.92 33.6001 184.04 33.5301L191.24 29.5701C191.35 29.5101 191.5 29.55 191.56 29.66C191.62 29.77 191.58 29.9101 191.47 29.9801L191.46 29.9901Z" fill="#686767"/>
      <path d="M177.09 37.9499L169.91 41.9299C169.78 41.9999 169.61 41.9601 169.53 41.8201C169.45 41.6801 169.5 41.5199 169.64 41.4399L176.84 37.48C176.97 37.41 177.13 37.4601 177.2 37.5801C177.27 37.7101 177.22 37.8699 177.1 37.9399L177.09 37.9499Z" fill="#686767"/>
      <path d="M162.73 45.9199L155.55 49.8999C155.4 49.9799 155.21 49.93 155.13 49.78C155.05 49.63 155.1 49.4401 155.25 49.3601L162.45 45.3999C162.59 45.3199 162.77 45.37 162.85 45.52C162.93 45.66 162.88 45.8399 162.74 45.9199H162.73Z" fill="#686767"/>
      <path d="M148.36 53.8799L141.18 57.8601C141.02 57.9501 140.81 57.89 140.72 57.73C140.63 57.57 140.69 57.36 140.85 57.27L148.05 53.3101C148.21 53.2201 148.4 53.2799 148.49 53.4399C148.58 53.5999 148.52 53.7899 148.36 53.8799Z" fill="#686767"/>
      <path d="M134.001 61.8402L126.82 65.8202C126.64 65.9202 126.42 65.85 126.32 65.68C126.22 65.5 126.291 65.28 126.461 65.18L133.661 61.2201C133.831 61.1301 134.041 61.1902 134.141 61.3602C134.231 61.5302 134.171 61.7402 134.001 61.8402Z" fill="#686767"/>
      <path d="M119.63 69.7899L112.43 73.7499C112.26 73.8399 112.04 73.78 111.95 73.61C111.86 73.44 111.92 73.2198 112.09 73.1298L119.27 69.1498C119.45 69.0498 119.67 69.1199 119.77 69.2899C119.87 69.4699 119.8 69.6899 119.63 69.7899Z" fill="#686767"/>
      <path d="M105.23 77.71L98.0299 81.6699C97.8699 81.7599 97.6798 81.7 97.5898 81.54C97.4998 81.38 97.5598 81.1901 97.7198 81.1001L104.9 77.1201C105.06 77.0301 105.27 77.09 105.36 77.25C105.45 77.41 105.39 77.62 105.23 77.71Z" fill="#686767"/>
      <path d="M90.84 85.6202L83.64 89.5801C83.5 89.6601 83.32 89.61 83.24 89.46C83.16 89.32 83.21 89.1401 83.36 89.0601L90.54 85.0801C90.69 85.0001 90.88 85.05 90.96 85.2C91.04 85.35 90.99 85.5402 90.84 85.6202Z" fill="#686767"/>
      <path d="M76.4396 93.5301L69.2396 97.4901C69.1096 97.5601 68.9497 97.51 68.8797 97.39C68.8097 97.26 68.8596 97.1001 68.9796 97.0301L76.1597 93.0501C76.2897 92.9801 76.4597 93.02 76.5397 93.16C76.6197 93.3 76.5697 93.4601 76.4297 93.5401L76.4396 93.5301Z" fill="#686767"/>
      <path d="M62.0499 101.44L54.8498 105.4C54.7398 105.46 54.5898 105.42 54.5298 105.31C54.4698 105.2 54.5098 105.05 54.6198 104.99L61.7999 101.01C61.9199 100.94 62.0698 100.99 62.1398 101.11C62.2098 101.23 62.1598 101.38 62.0398 101.45L62.0499 101.44Z" fill="#686767"/>
      <path d="M47.66 109.35L40.4599 113.31C40.3599 113.36 40.24 113.33 40.18 113.23C40.13 113.13 40.16 113.01 40.26 112.95L47.4399 108.97C47.5499 108.91 47.6799 108.95 47.7399 109.06C47.7999 109.17 47.76 109.3 47.65 109.36L47.66 109.35Z" fill="#686767"/>
      <path d="M33.26 117.26L26.05 121.19C25.98 121.23 25.8899 121.2 25.8499 121.13C25.8099 121.06 25.84 120.97 25.91 120.93L33.0799 116.93C33.1699 116.88 33.2899 116.91 33.3399 117C33.3899 117.09 33.36 117.21 33.27 117.26H33.26Z" fill="#686767"/>
      <path d="M18.8402 125.13L11.6303 129.06C11.6303 129.06 11.5603 129.06 11.5403 129.03C11.5203 129 11.5402 128.96 11.5702 128.94L18.7402 124.93C18.7902 124.9 18.8603 124.92 18.8903 124.97C18.9203 125.02 18.9002 125.09 18.8502 125.12L18.8402 125.13Z" fill="#686767"/>
      <path d="M4.42017 132.99L0.910156 134.9L4.40015 132.95C4.40015 132.95 4.42018 132.95 4.43018 132.95C4.43018 132.96 4.43018 132.97 4.43018 132.98L4.42017 132.99Z" fill="#686767"/>
    </g>
    <path d="M133.84 37.6001V129.64C133.84 129.64 133.43 155.59 187.04 158.28C187.04 158.28 230.73 159.5 245.12 136.74V37.6001" fill="white"/>
    <path d="M187.98 158.8C187.39 158.8 187.06 158.8 187.02 158.8C171.63 158.03 150.99 154.71 139.97 143.32C133.3 136.43 133.33 129.93 133.33 129.65V37.6101H134.33V129.65C134.33 129.91 134.63 155.16 187.06 157.79C187.49 157.79 230.47 158.74 244.61 136.6V37.6001H245.61V136.89L245.53 137.01C232.35 157.87 194.48 158.79 187.97 158.79L187.98 158.8Z" fill="black"/>
    <path d="M189.85 63.6001C220.783 63.6001 245.86 50.9387 245.86 35.3201C245.86 19.7015 220.783 7.04004 189.85 7.04004C158.916 7.04004 133.84 19.7015 133.84 35.3201C133.84 50.9387 158.916 63.6001 189.85 63.6001Z" fill="white"/>
    <path d="M189.85 64.1001C158.69 64.1001 133.34 51.1901 133.34 35.3201C133.34 19.4501 158.69 6.54004 189.85 6.54004C221.01 6.54004 246.36 19.4501 246.36 35.3201C246.36 51.1901 221.01 64.1001 189.85 64.1001ZM189.85 7.53003C159.24 7.53003 134.34 19.9901 134.34 35.3101C134.34 50.6301 159.24 63.0901 189.85 63.0901C220.46 63.0901 245.36 50.6301 245.36 35.3101C245.36 19.9901 220.46 7.53003 189.85 7.53003Z" fill="black"/>
    <path d="M133.921 68.6899C133.921 68.6899 137.841 92.4401 182.881 95.3701C182.881 95.3701 219.841 98.0601 234.291 85.5801" fill="white"/>
    <path d="M191.621 96.1399C186.681 96.1399 183.291 95.9101 182.851 95.8701C137.931 92.9401 133.471 69.01 133.431 68.77L134.421 68.6101C134.461 68.8401 138.851 91.9999 182.921 94.8799C183.291 94.9099 219.851 97.41 233.971 85.21L234.621 85.97C224.421 94.79 203.531 96.1499 191.621 96.1499V96.1399Z" fill="#A3A3A3"/>
    <path d="M311.291 1.12988L234.011 42.4399V163.12L256.891 174.42L334.771 133.4V13.9099L311.291 1.12988Z" fill="white"/>
    <path d="M256.901 174.98L233.511 163.43V42.1399L233.771 42L311.291 0.560059L335.271 13.6101V133.7L256.901 174.98ZM234.511 162.81L256.891 173.85L334.271 133.09V14.2L311.291 1.68994L234.511 42.74V162.81Z" fill="black"/>
    <path d="M233.65 42.6399L255.49 54.74V174.42" fill="white"/>
    <path d="M255.99 174.42H254.99V55.04L233.4 43.0801L233.89 42.2L255.99 54.45V174.42Z" fill="#A3A3A3"/>
    <path d="M334.144 12.76L255.367 54.1538L255.832 55.039L334.609 13.6453L334.144 12.76Z" fill="#A3A3A3"/>
    <path d="M294.341 63.6001L273.97 76.5901L263.351 101.38L291.39 121.16H297.7L314.121 76.5901L300.65 63.6001H294.341Z" fill="#52B54A"/>
    <path d="M298.051 121.66H291.23L291.101 121.57L262.73 101.56L273.581 76.25L294.2 63.1001H300.861L314.7 76.45L298.051 121.66ZM291.551 120.66H297.361L313.541 76.72L300.46 64.1001H294.49L274.38 76.9299L263.97 101.21L291.551 120.66Z" fill="#070101"/>
    <path d="M144.96 52.24L144 146.2C144 146.2 132.72 133.28 133.84 129.65V37.6001C133.96 38.2101 134.13 38.92 134.38 39.71C134.41 39.81 134.8 40.98 135.42 42.24C137.05 45.52 139.63 48.1599 139.63 48.1599C141.51 50.0799 143.43 51.38 144.96 52.23V52.24Z" fill="#52B54A"/>
    <path d="M144.48 147.52L143.62 146.53C142.45 145.2 132.33 133.46 133.34 129.58V37.6001L134.33 37.51C134.46 38.2 134.64 38.8901 134.86 39.5601C134.9 39.6801 135.28 40.81 135.88 42.02C137.45 45.19 139.98 47.7901 140 47.8101C141.54 49.3801 143.29 50.72 145.21 51.8L145.47 51.95L144.49 147.52H144.48ZM134.34 41.04V129.73L134.32 129.8C133.61 132.12 139.15 139.72 143.52 144.87L144.47 52.53C142.57 51.43 140.82 50.08 139.29 48.52C139.18 48.41 136.63 45.78 134.99 42.47C134.74 41.96 134.52 41.46 134.35 41.04H134.34Z" fill="#070101"/>
    <path d="M300.521 63.6001L280.15 76.5901L269.521 101.38L297.571 121.16L320.291 76.5901L300.521 63.6001Z" fill="white"/>
    <path d="M297.75 121.9L268.91 101.56L279.76 76.25L300.53 63.01L320.95 76.4199L297.76 121.91L297.75 121.9ZM270.14 101.21L297.38 120.42L319.64 76.76L300.51 64.2L280.55 76.9299L270.14 101.21Z" fill="black"/>
  </svg>
)

// Mock data for block storage volumes
const mockVolumes = [
  {
    id: "vol-001",
    name: "web-server-root",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Bootable",
    size: "50",
    attachedInstance: "web-server-01",
    vpc: "vpc-main-prod",
    status: "attached",
    createdOn: "2024-01-15T10:30:00Z",
  },
  {
    id: "vol-002", 
    name: "database-storage",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "200",
    attachedInstance: "db-server-01",
    vpc: "vpc-main-prod",
    status: "attached",
    createdOn: "2024-01-20T14:22:00Z",
  },
  {
    id: "vol-003",
    name: "backup-volume",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "500",
    attachedInstance: "-",
    vpc: "vpc-backup",
    status: "available",
    createdOn: "2024-02-01T09:15:00Z",
  },
  {
    id: "vol-013",
    name: "creating-volume",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "80",
    attachedInstance: "-",
    vpc: "vpc-main-prod",
    status: "creating",
    createdOn: "2024-03-12T10:30:00Z",
  },
  {
    id: "vol-014",
    name: "failed-volume-2",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "150",
    attachedInstance: "-",
    vpc: "vpc-main-prod",
    status: "failed",
    createdOn: "2024-03-13T14:20:00Z",
  },
  {
    id: "vol-015",
    name: "deleting-volume-2",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "100",
    attachedInstance: "-",
    vpc: "vpc-main-prod",
    status: "deleting",
    deletionStartedOn: "2024-03-14T09:15:00Z",
    estimatedDeletionTime: 10,
    createdOn: "2024-03-14T09:15:00Z",
  },
  {
    id: "vol-016",
    name: "detached-volume-2",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "200",
    attachedInstance: "-",
    vpc: "vpc-main-prod",
    status: "detached",
    createdOn: "2024-03-15T11:45:00Z",
  },
  {
    id: "vol-004",
    name: "temp-processing",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "100",
    attachedInstance: "worker-node-03",
    vpc: "vpc-main-prod",
    status: "attached",
    createdOn: "2024-02-10T16:45:00Z",
  },
  {
    id: "vol-005",
    name: "logs-storage",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "80",
    attachedInstance: "-",
    vpc: "vpc-logs",
    status: "creating",
    createdOn: "2024-02-15T12:30:00Z",
  },
  {
    id: "vol-010",
    name: "failed-volume",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "120",
    attachedInstance: "-",
    vpc: "vpc-main-prod",
    status: "failed",
    createdOn: "2024-03-05T10:15:00Z",
  },
  {
    id: "vol-011",
    name: "deleting-volume",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "60",
    attachedInstance: "-",
    vpc: "vpc-main-prod",
    status: "deleting",
    deletionStartedOn: "2024-03-14T09:15:00Z",
    estimatedDeletionTime: 8,
    createdOn: "2024-03-08T14:20:00Z",
  },
  {
    id: "vol-012",
    name: "detached-volume",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "90",
    attachedInstance: "-",
    vpc: "vpc-main-prod",
    status: "detached",
    createdOn: "2024-03-10T09:30:00Z",
  },
  {
    id: "vol-006",
    name: "app-server-data",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "150",
    attachedInstance: "app-server-02",
    vpc: "vpc-main-prod",
    status: "attached",
    createdOn: "2024-02-20T08:15:00Z",
  },
  {
    id: "vol-007",
    name: "cache-volume",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "75",
    attachedInstance: "cache-server-01",
    vpc: "vpc-main-prod",
    status: "attached",
    createdOn: "2024-02-22T11:20:00Z",
  },
  {
    id: "vol-008",
    name: "staging-root",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Bootable",
    size: "40",
    attachedInstance: "staging-server-01",
    vpc: "vpc-staging",
    status: "attached",
    createdOn: "2024-02-25T14:30:00Z",
  },
  {
    id: "vol-009",
    name: "analytics-storage",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "300",
    attachedInstance: "-",
    vpc: "vpc-analytics",
    status: "available",
    createdOn: "2024-03-01T09:45:00Z",
  },
  {
    id: "vol-010",
    name: "test-environment",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "60",
    attachedInstance: "test-server-01",
    vpc: "vpc-testing",
    status: "attached",
    createdOn: "2024-03-05T16:10:00Z",
  },
  {
    id: "vol-011",
    name: "media-storage",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "1000",
    attachedInstance: "-",
    vpc: "vpc-media",
    status: "available",
    createdOn: "2024-03-08T13:25:00Z",
  },
  {
    id: "vol-012",
    name: "backup-secondary",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "750",
    attachedInstance: "-",
    vpc: "vpc-backup",
    status: "creating",
    createdOn: "2024-03-10T10:00:00Z",
  },
  {
    id: "vol-013",
    name: "ml-training-data",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "2000",
    attachedInstance: "ml-server-01",
    vpc: "vpc-ml",
    status: "attached",
    createdOn: "2024-03-12T07:30:00Z",
  },
  {
    id: "vol-014",
    name: "dev-workspace",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "120",
    attachedInstance: "dev-server-01",
    vpc: "vpc-development",
    status: "attached",
    createdOn: "2024-03-15T15:20:00Z",
  },
  {
    id: "vol-015",
    name: "monitoring-logs",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "90",
    attachedInstance: "-",
    vpc: "vpc-monitoring",
    status: "available",
    createdOn: "2024-03-18T12:45:00Z",
  },
]

// Mock backup data for block storage
const mockBackups = [
  {
    id: "backup-001",
    name: "web-server-backup-primary",
    size: "50 GB",
    volumeName: "web-server-root",
    type: "Primary",
    status: "completed",
    vpc: "vpc-main-prod",
    createdOn: "2024-12-19T08:30:00Z",
    description: "Primary backup of web server root volume",
  },
  {
    id: "backup-002", 
    name: "db-storage-backup-delta",
    size: "25 GB",
    volumeName: "database-storage",
    type: "Delta",
    status: "completed",
    vpc: "vpc-main-prod",
    createdOn: "2024-12-19T02:00:00Z",
    description: "Daily delta backup of database storage",
  },
  {
    id: "backup-003",
    name: "app-server-backup-primary",
    size: "120 GB",
    volumeName: "app-server-data",
    type: "Primary",
    status: "creating",
    vpc: "vpc-main-prod",
    createdOn: "2024-12-19T10:15:00Z",
    description: "Primary backup of application server data volume",
  },
  {
    id: "backup-004",
    name: "backup-vol-delta",
    size: "75 GB",
    volumeName: "backup-volume",
    type: "Delta",
    status: "completed",
    vpc: "vpc-backup",
    createdOn: "2024-12-18T20:45:00Z",
    description: "Delta backup of backup volume",
  },
  {
    id: "backup-005",
    name: "staging-backup-primary", 
    size: "40 GB",
    volumeName: "staging-root",
    type: "Primary",
    status: "completed",
    vpc: "vpc-staging",
    createdOn: "2024-12-18T16:30:00Z",
    description: "Primary backup of staging server root volume",
  },
  {
    id: "backup-006",
    name: "temp-processing-backup-delta",
    size: "15 GB",
    volumeName: "temp-processing",
    type: "Delta",
    status: "completed",
    vpc: "vpc-main-prod",
    createdOn: "2024-12-19T06:20:00Z",
    description: "Delta backup of temporary processing volume",
  },
  {
    id: "backup-007",
    name: "logs-storage-backup-primary",
    size: "65 GB",
    volumeName: "logs-storage",
    type: "Primary",
    status: "failed",
    vpc: "vpc-logs",
    createdOn: "2024-12-17T14:10:00Z",
    description: "Primary backup of logs storage volume - backup failed",
  },
  {
    id: "backup-008",
    name: "cache-backup-delta",
    size: "30 GB", 
    volumeName: "cache-volume",
    type: "Delta",
    status: "completed",
    vpc: "vpc-main-prod",
    createdOn: "2024-12-19T04:15:00Z",
    description: "Delta backup of cache volume",
  },
  {
    id: "backup-009",
    name: "analytics-backup-primary",
    size: "280 GB",
    volumeName: "analytics-storage",
    type: "Primary",
    status: "completed",
    vpc: "vpc-analytics",
    createdOn: "2024-12-18T12:00:00Z",
    description: "Primary backup of analytics storage volume",
  },
  {
    id: "backup-010",
    name: "test-env-backup",
    size: "55 GB",
    volumeName: "test-environment",
    type: "Primary",
    status: "creating",
    vpc: "vpc-testing",
    createdOn: "2024-12-19T09:45:00Z",
    description: "Primary backup of test environment volume",
  },
  {
    id: "backup-011",
    name: "media-backup-delta",
    size: "150 GB",
    volumeName: "media-storage",
    type: "Delta",
    status: "completed",
    vpc: "vpc-media",
    createdOn: "2024-12-18T23:30:00Z",
    description: "Delta backup of media storage volume",
  },
  {
    id: "backup-012",
    name: "ml-training-backup-primary",
    size: "1.8 TB",
    volumeName: "ml-training-data",
    type: "Primary",
    status: "completed",
    vpc: "vpc-ml",
    createdOn: "2024-12-18T08:00:00Z",
    description: "Primary backup of ML training data volume",
  },
  {
    id: "backup-013",
    name: "dev-workspace-backup-delta",
    size: "35 GB",
    volumeName: "dev-workspace",
    type: "Delta",
    status: "completed",
    vpc: "vpc-development",
    createdOn: "2024-12-19T07:30:00Z",
    description: "Delta backup of development workspace",
  },
  {
    id: "backup-014",
    name: "monitoring-backup-primary",
    size: "80 GB",
    volumeName: "monitoring-logs",
    type: "Primary",
    status: "completed",
    vpc: "vpc-monitoring",
    createdOn: "2024-12-18T18:20:00Z",
    description: "Primary backup of monitoring logs volume",
  },
  {
    id: "backup-015",
    name: "backup-secondary-delta",
    size: "200 GB",
    volumeName: "backup-secondary",
    type: "Delta",
    status: "failed",
    vpc: "vpc-backup",
    createdOn: "2024-12-19T03:45:00Z",
    description: "Delta backup of secondary backup volume - backup failed",
  }
]

// Tab content components with empty states
function VolumesSection() {
  const [selectedVolume, setSelectedVolume] = useState<any>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAttachedAlertOpen, setIsAttachedAlertOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false)
  const [volumeToExtend, setVolumeToExtend] = useState<any>(null)
  const [showBackupModal, setShowBackupModal] = useState(false)
  const [instantBackupVolume, setInstantBackupVolume] = useState<any>(null)
  const [showSnapshotModal, setShowSnapshotModal] = useState(false)
  const [instantSnapshotVolume, setInstantSnapshotVolume] = useState<any>(null)
  const { toast } = useToast()

  // Filter data based on user type for demo
  const filteredVolumes = filterDataForUser(mockVolumes)
  const showEmptyState = shouldShowEmptyState() && filteredVolumes.length === 0

  const handleDeleteClick = (volume: any) => {
    setSelectedVolume(volume)
    
    // Check if volume is attached to a VM
    if (volume.attachedInstance && volume.attachedInstance !== "-") {
      // Volume is attached - show alert preventing deletion
      setIsAttachedAlertOpen(true)
    } else {
      // Volume is not attached - show deletion confirmation
      setIsDeleteConfirmOpen(true)
    }
  }

  const handleExtendVolume = (volume: any) => {
    setVolumeToExtend(volume)
    setIsExtendModalOpen(true)
  }

  const handleCreateSnapshot = (volume: any) => {
    // Navigate to create snapshot page with volume context
    window.location.href = `/storage/block/snapshots/create?volumeId=${volume.id}`
  }

  const handleDeleteConfirm = async () => {
    if (!selectedVolume) return

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, you would refresh the data here
      console.log(`Deleting volume: ${selectedVolume.name}`)
      
      setIsDeleteModalOpen(false)
      setSelectedVolume(null)
    } catch (error) {
      throw error // Let the modal handle the error display
    }
  }

  const handleActualDelete = async () => {
    if (!selectedVolume) return

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real app, you would refresh the data here
      console.log(`Deleting volume: ${selectedVolume.name}`)
      
      // Reset state
      setIsDeleteConfirmOpen(false)
      setSelectedVolume(null)
    } catch (error) {
      throw error // Let the modal handle the error display
    }
  }

  const handleExtendConfirm = async (newSize: number) => {
    if (!volumeToExtend) return

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, you would update the volume data here
      console.log(`Extending volume ${volumeToExtend.name} to ${newSize} GB`)
      
      // Close modal and reset state
      setIsExtendModalOpen(false)
      setVolumeToExtend(null)
      
      // Refresh would happen in a real app
      // For now, just show success message via toast (handled in modal)
    } catch (error) {
      throw error // Let the modal handle the error
    }
  }

  const handleCreateInstantBackup = (volume: any) => {
    setInstantBackupVolume(volume)
    setShowBackupModal(true)
  }

  const handleCreateInstantSnapshot = (volume: any) => {
    setInstantSnapshotVolume(volume)
    setShowSnapshotModal(true)
  }

  const handleRetryVolume = async (volume: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, you would call the retry API here
      console.log(`Retrying volume creation: ${volume.name}`)
      
      toast({
        title: "Volume Retry Initiated",
        description: `Retry process started for volume '${volume.name}'. This may take a few minutes.`,
      })
    } catch (error) {
      toast({
        title: "Retry Failed",
        description: "Failed to initiate retry process. Please try again.",
        variant: "destructive",
      })
    }
  }

  const columns = [
    {
      key: "name",
      label: "Volume Name",
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => {
        // Only show link for volumes with "attached" or "available" status
        if (row.status === "attached" || row.status === "available") {
          return (
            <a
              href={`/storage/block/volumes/${row.id}`}
              className="text-primary font-medium hover:underline leading-5"
            >
              {value}
            </a>
          );
        }
        // For "creating" status, just show plain text
        return <div className="font-medium leading-5">{value}</div>;
      },
    },
    {
      key: "type",
      label: "Volume Type",
      sortable: true,
      render: (value: string) => (
        <div className="leading-5">{value}</div>
      ),
    },
    {
      key: "role",
      label: "Volume Role",
      sortable: true,
      render: (value: string) => (
        <div className="leading-5">{value}</div>
      ),
    },
    {
      key: "size",
      label: "Size (In GB)",
      sortable: true,
      render: (value: string) => (
        <div className="leading-5">{value} GB</div>
      ),
    },
    {
      key: "attachedInstance",
      label: "Attached Instance Name",
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <div className="leading-5">{value === "-" ? "Not attached" : value}</div>
      ),
    },
    {
      key: "createdOn",
      label: "Created On",
      sortable: true,
      render: (value: string) => {
        const date = new Date(value);
        return (
          <div className="text-muted-foreground leading-5">
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string, row: any) => {
        if (value === "deleting") {
          return <VolumeDeletionStatus volume={row} compact={true} />
        }
        return (
          <div className="flex items-center gap-2">
            <StatusBadge status={value} />
            {value === "failed" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRetryVolume(row)}
                className="h-6 px-2 text-xs"
              >
                Retry
              </Button>
            )}
          </div>
        )
      },
    },
    {
      key: "actions",
      label: "Action",
      align: "right" as const,
      render: (_: any, row: any) => (
        <div className="flex justify-end">
          <ActionMenu
            viewHref={`/storage/block/volumes/${row.id}`}
            editHref={row.status !== "creating" ? `/storage/block/volumes/${row.id}/edit` : undefined}
            onExtend={row.status !== "creating" ? () => handleExtendVolume(row) : undefined}
            onCustomDelete={() => handleDeleteClick(row)}
            resourceName={row.name}
            resourceType="Volume"
            deleteLabel="Delete Volume"
            onCreateInstantBackup={() => handleCreateInstantBackup(row)}
            onCreateInstantSnapshot={() => handleCreateInstantSnapshot(row)}
            onRetry={row.status === "failed" ? () => handleRetryVolume(row) : undefined}
          />
        </div>
      ),
    },
  ]

  // Add actions property to each volume row for DataTable
  const dataWithActions = filteredVolumes.map((volume) => ({ ...volume, actions: null }))

  const handleRefresh = () => {
    window.location.reload()
  }

  // Get unique VPCs for filter options
  const vpcOptions = Array.from(new Set(filteredVolumes.map(volume => volume.vpc)))
    .map(vpc => ({ value: vpc, label: vpc }))

  // Add "All VPCs" option at the beginning
  vpcOptions.unshift({ value: "all", label: "All VPCs" })

  return (
    <div className="space-y-6">
      {showEmptyState ? (
        <Card className="mt-8">
          <CardContent>
            <EmptyState
              {...getEmptyStateMessage('volumes')}
              icon={volumeIcon}
            />
          </CardContent>
        </Card>
      ) : (
        <ShadcnDataTable
          columns={columns}
          data={dataWithActions}
          searchableColumns={["name", "attachedInstance"]}
          defaultSort={{ column: "createdOn", direction: "desc" }}
          pageSize={10}
          enableSearch={true}
          enablePagination={true}
          onRefresh={handleRefresh}
          enableVpcFilter={true}
          vpcOptions={vpcOptions}
        />
      )}

      {/* Alert for volumes attached to VMs */}
      {selectedVolume && (
        <AttachedVolumeAlert
          isOpen={isAttachedAlertOpen}
          onClose={() => {
            setIsAttachedAlertOpen(false)
            setSelectedVolume(null)
          }}
          volume={{
            name: selectedVolume.name,
            attachedInstance: selectedVolume.attachedInstance
          }}
        />
      )}

      {/* Confirmation for detached volumes */}
      {selectedVolume && (
        <DeleteVolumeConfirmation
          isOpen={isDeleteConfirmOpen}
          onClose={() => {
            setIsDeleteConfirmOpen(false)
            setSelectedVolume(null)
          }}
          volume={{
            name: selectedVolume.name,
            id: selectedVolume.id
          }}
          onConfirm={handleActualDelete}
        />
      )}

      {volumeToExtend && (
        <ExtendVolumeModal
          isOpen={isExtendModalOpen}
          onClose={() => {
            setIsExtendModalOpen(false)
            setVolumeToExtend(null)
          }}
          volume={volumeToExtend}
          onConfirm={handleExtendConfirm}
        />
      )}

      <CreateBackupModal
        open={showBackupModal}
        onClose={() => { setShowBackupModal(false); setInstantBackupVolume(null); }}
        onCreate={async ({ name, description, tags }) => {
          // Static price logic: $0.10/GB
          const price = instantBackupVolume ? `$${(Number(instantBackupVolume.size) * 0.10).toFixed(2)}` : "$0.00";
          // Add to mockBackups (design mode: just log or update local state if you want to show instantly)
          // For now, just toast
          toast({
            title: "Backup Created",
            description: `Backup '${name}' for volume '${instantBackupVolume?.name}' created. Price: ${price}`,
          });
          setShowBackupModal(false);
          setInstantBackupVolume(null);
        }}
        price={instantBackupVolume ? `$${(Number(instantBackupVolume.size) * 0.10).toFixed(2)}` : undefined}
        volume={instantBackupVolume}
      />
      <CreateSnapshotModal
        open={showSnapshotModal}
        onClose={() => { setShowSnapshotModal(false); setInstantSnapshotVolume(null); }}
        volume={instantSnapshotVolume}
        price={instantSnapshotVolume ? `$${(Number(instantSnapshotVolume.size) * 0.05).toFixed(2)}` : undefined}
        onCreate={async ({ volume, name, description }) => {
          toast({
            title: "Snapshot Created",
            description: `Snapshot '${name}' for volume '${volume}' created.`,
          });
          setShowSnapshotModal(false);
          setInstantSnapshotVolume(null);
        }}
      />
    </div>
  )
}

function SnapshotsSection() {
  const [selectedSnapshot, setSelectedSnapshot] = useState<any>(null)
  const [deleteStep, setDeleteStep] = useState<"constraint" | "confirmation" | null>(null)
  const [constraintReason, setConstraintReason] = useState("")
  const { toast } = useToast()

  // Filter data based on user type for demo
  const filteredSnapshots = filterDataForUser(snapshots)
  const showEmptyState = shouldShowEmptyState() && filteredSnapshots.length === 0

  const handleDeleteClick = (snapshot: any) => {
    setSelectedSnapshot(snapshot)
    
    // Check if this is a Primary snapshot and if it can be safely deleted
    if (snapshot.type === "Primary" && !canDeletePrimarySnapshot(snapshot.id)) {
      const reason = `You must create another Primary snapshot for "${snapshot.volumeVM}" before deleting this one. This is the only Primary snapshot for this resource.`
      setConstraintReason(reason)
      setDeleteStep("constraint")
    } else {
      // Snapshot can be deleted, show confirmation modal
      setDeleteStep("confirmation")
    }
  }

  const handleConstraintConfirm = () => {
    // Move to confirmation step if deletion is allowed
    setDeleteStep("confirmation")
  }

  const handleActualDelete = async () => {
    if (!selectedSnapshot) return

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real app, you would refresh the data here
      console.log(`Deleting snapshot: ${selectedSnapshot.name}`)
      
      // Reset state
      setDeleteStep(null)
      setSelectedSnapshot(null)
    } catch (error) {
      throw error // Let the modal handle the error display
    }
  }

  const handleCloseModals = () => {
    setDeleteStep(null)
    setSelectedSnapshot(null)
    setConstraintReason("")
  }

  const columns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => (
        <a
          href={`/storage/block/snapshots/${row.id}`}
          className="text-primary font-medium hover:underline leading-5"
        >
          {value}
        </a>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (value: string) => (
        <div className="leading-5">{value}</div>
      ),
    },
    {
      key: "size",
      label: "Size",
      sortable: true,
      render: (value: string) => (
        <div className="leading-5">{value}</div>
      ),
    },
    {
      key: "volumeVM",
      label: "Volume / VM",
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <div className="leading-5">{value}</div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: "createdOn",
      label: "Created On",
      sortable: true,
      render: (value: string) => (
        <div className="leading-5">{new Date(value).toLocaleDateString()}</div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right" as const,
      render: (_: any, row: any) => (
        <div className="flex justify-end">
          <ActionMenu
            viewHref={`/storage/block/snapshots/${row.id}`}
            editHref={`/storage/block/snapshots/${row.id}/edit`}
            onCustomDelete={() => handleDeleteClick(row)}
            resourceName={row.name}
            resourceType="Snapshot"
            deleteLabel="Delete Snapshot"
          />
        </div>
      ),
    },
  ]

  // Add actions property to each snapshot row for DataTable
  const dataWithActions = filteredSnapshots.map((snapshot) => ({ ...snapshot, actions: null }))

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      {showEmptyState ? (
        <Card className="mt-8">
          <CardContent>
            <EmptyState
              {...getEmptyStateMessage('snapshots')}
            />
          </CardContent>
        </Card>
      ) : (
        <ShadcnDataTable
          columns={columns}
          data={dataWithActions}
          searchableColumns={["name", "volumeVM"]}
          defaultSort={{ column: "createdOn", direction: "desc" }}
          pageSize={10}
          enableSearch={true}
          enablePagination={true}
          onRefresh={handleRefresh}
        />
      )}

      {/* Step 1: Constraint Warning Modal */}
      {selectedSnapshot && (
        <DeleteSnapshotConstraintModal
          open={deleteStep === "constraint"}
          onClose={handleCloseModals}
          snapshot={selectedSnapshot}
          constraintReason={constraintReason}
          onConfirm={deleteStep === "constraint" && !constraintReason.includes("must create another") ? handleConstraintConfirm : undefined}
        />
      )}

      {/* Step 2: Name Confirmation Modal */}
      {selectedSnapshot && (
        <DeleteSnapshotConfirmationModal
          open={deleteStep === "confirmation"}
          onClose={handleCloseModals}
          snapshot={selectedSnapshot}
          onConfirm={handleActualDelete}
        />
      )}
    </div>
  )
}

function BackupSection() {
  const [selectedBackup, setSelectedBackup] = useState<any>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false)
  const [restoreInProgress, setRestoreInProgress] = useState(false)
  const [restoreVolumeName, setRestoreVolumeName] = useState("");
  const { toast } = useToast()

  // Filter data based on user type for demo
  const filteredBackups = filterDataForUser(mockBackups)
  const showEmptyState = shouldShowEmptyState() && filteredBackups.length === 0

  const handleDeleteClick = (backup: any) => {
    setSelectedBackup(backup)
    setIsDeleteModalOpen(true)
  }

  const handleRestoreClick = (backup: any) => {
    setSelectedBackup(backup)
    setRestoreVolumeName("")
    setIsRestoreModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedBackup) return

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real app, you would refresh the data here
      console.log(`Deleting backup: ${selectedBackup.name}`)
      
      toast({
        title: "Backup deleted",
        description: `Backup "${selectedBackup.name}" has been successfully deleted.`,
      })
      
      // Reset state
      setIsDeleteModalOpen(false)
      setSelectedBackup(null)
    } catch (error) {
      throw error // Let the modal handle the error display
    }
  }

  // Simulate restore logic: restore all deltas up to primary for the same volume
  const handleRestoreConfirm = async () => {
    setRestoreInProgress(true)
    // Simulate restore delay
    setTimeout(() => {
      setRestoreInProgress(false)
      setIsRestoreModalOpen(false)
      toast({
        title: "Restore started (mock)",
        description: `Restoring backup \"${selectedBackup?.name}\" to new volume \"${restoreVolumeName}\" and all previous deltas up to the primary for volume \"${selectedBackup?.volumeName}\".`,
      })
      setSelectedBackup(null)
      setRestoreVolumeName("")
    }, 1500)
  }

  const columns = [
    {
      key: "name",
      label: "Backup Name",
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => (
        <a
          href={`/storage/block/backup/${row.id}`}
          className="text-primary font-medium hover:underline leading-5"
        >
          {value}
        </a>
      ),
    },
    {
      key: "size",
      label: "Size",
      sortable: true,
      render: (value: string) => (
        <div className="leading-5">{value}</div>
      ),
    },
    {
      key: "volumeName",
      label: "Volume Name",
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <div className="leading-5">{value}</div>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (value: string) => (
        <div className="leading-5">{value}</div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: "createdOn",
      label: "Created",
      sortable: true,
      render: (value: string) => {
        const date = new Date(value);
        return (
          <div className="text-muted-foreground leading-5">
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      align: "right" as const,
      render: (_: any, row: any) => (
        <div className="flex justify-end">
          <ActionMenu
            viewHref={`/storage/block/backup/${row.id}`}
            editHref={`/storage/block/backup/${row.id}/edit`}
            onCustomDelete={() => handleDeleteClick(row)}
            onRestore={() => handleRestoreClick(row)}
            resourceName={row.name}
            resourceType="Backup"
            deleteLabel="Delete Backup"
          />
        </div>
      ),
    },
  ]

  // Add actions property to each backup row for DataTable
  const dataWithActions = filteredBackups.map((backup) => ({ ...backup, actions: null }))

  const handleRefresh = () => {
    window.location.reload()
  }

  // Get unique VPCs for filter options
  const vpcOptions = Array.from(new Set(filteredBackups.map(backup => backup.vpc)))
    .map(vpc => ({ value: vpc, label: vpc }))

  // Add "All VPCs" option at the beginning
  vpcOptions.unshift({ value: "all", label: "All VPCs" })

  return (
    <div>
      {showEmptyState ? (
        <Card className="mt-8">
          <CardContent>
            <EmptyState
              {...getEmptyStateMessage('backup')}
            />
          </CardContent>
        </Card>
      ) : (
        <ShadcnDataTable
          columns={columns}
          data={dataWithActions}
          searchableColumns={["name", "volumeName"]}
          defaultSort={{ column: "createdOn", direction: "desc" }}
          pageSize={10}
          enableSearch={true}
          enablePagination={true}
          onRefresh={handleRefresh}
          enableVpcFilter={true}
          vpcOptions={vpcOptions}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        resourceName={selectedBackup?.name || ""}
        resourceType="Backup"
        onConfirm={handleDeleteConfirm}
      />

      {/* Restore Confirmation Modal */}
      <Dialog open={isRestoreModalOpen} onOpenChange={setIsRestoreModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Restore Backup</DialogTitle>
            <DialogDescription>
              Restore a backup to create a new volume with the backup data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedBackup && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="space-y-3 mb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Backup Name:</span>
                    <span className="text-sm font-medium">{selectedBackup.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Size:</span>
                    <span className="text-sm font-medium">{selectedBackup.size} GB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Volume Name:</span>
                    <span className="text-sm font-medium">{selectedBackup.volumeName}</span>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="restoreVolumeName">New Volume Name *</Label>
              <Input
                id="restoreVolumeName"
                type="text"
                placeholder="Enter new volume name"
                value={restoreVolumeName}
                onChange={e => setRestoreVolumeName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restoreVolumeSize">Volume Size (GB) *</Label>
              <Input
                id="restoreVolumeSize"
                type="number"
                value={selectedBackup ? parseInt(selectedBackup.size) : ""}
                readOnly
                className="bg-gray-50"
              />
            </div>
            {selectedBackup && (
              <div 
                className="p-4 rounded-lg mt-2" 
                style={{
                  boxShadow: "rgba(14, 114, 180, 0.1) 0px 0px 0px 1px inset",
                  background: "linear-gradient(263deg, rgba(15, 123, 194, 0.08) 6.86%, rgba(15, 123, 194, 0.02) 96.69%)"
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-black">Pricing Summary</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-black">Volume Price:</span>
                  <span className="font-semibold text-black">₹{(parseInt(selectedBackup.size) * 1.8).toFixed(2)} per month</span>
                </div>
              </div>
            )}
            <span className="text-xs text-muted-foreground">(Design mode: this is a mock operation)</span>
          </div>
          <DialogFooter className="flex gap-2 sm:justify-end sticky bottom-0 bg-white border-t pt-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRestoreModalOpen(false)}
              disabled={restoreInProgress}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleRestoreConfirm}
              disabled={restoreInProgress || !restoreVolumeName}
            >
              {restoreInProgress ? "Restoring..." : "Restore"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const tabs = [
  { id: "volumes", label: "Volumes" },
  { id: "snapshots", label: "Snapshots" },
  { id: "backup", label: "Backup" },
]

export default function BlockStoragePage() {
  const pathname = usePathname()
  const router = useRouter()
  
  // Determine active tab from URL, but don't change URL on tab change
  const getActiveTabFromPath = () => {
    if (pathname.includes('/volumes')) return "volumes"
    if (pathname.includes('/snapshots')) return "snapshots"
    if (pathname.includes('/backup')) return "backup"
    return "volumes" // default to volumes
  }
  
  const [activeTab, setActiveTab] = useState(getActiveTabFromPath())

  // Handle tab change without URL navigation to prevent refreshes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    // Don't navigate - just change the local state
  }

  // Update active tab when URL changes (for direct navigation)
  useEffect(() => {
    setActiveTab(getActiveTabFromPath())
  }, [pathname])

  // Get title and description based on active tab
  const getPageInfo = () => {
    switch (activeTab) {
      case "volumes":
        return { 
          title: "Block Storage", 
          description: "Provision, manage, and attach block storage volumes to your cloud resources."
        }
      case "snapshots":
        return { 
          title: "Block Storage", 
          description: "Create and manage snapshots of your block storage volumes."
        }
      case "backup":
        return { 
          title: "Block Storage", 
          description: "Create and manage backups of your block storage volumes."
        }
      default:
        return { 
          title: "Block Storage", 
          description: "Manage your block storage resources"
        }
    }
  }

  // Get dynamic button info based on active tab
  const getButtonInfo = () => {
    switch (activeTab) {
      case "volumes":
        return { 
          href: "/storage/block/volumes/create", 
          label: "Create Volume"
        }
      case "snapshots":
        return "multiple" // Special case for multiple buttons
      case "backup":
        return "multiple" // Special case for multiple buttons
      default:
        return { 
          href: "/storage/block/volumes/create", 
          label: "Create Volume"
        }
    }
  }

  const { title, description } = getPageInfo()
  const buttonInfo = getButtonInfo()

  // Create header actions based on button info
  const getHeaderActions = () => {
    if (buttonInfo === "multiple") {
      // Special case for multiple buttons based on active tab
      if (activeTab === "snapshots") {
        return (
          <div className="flex items-center gap-3">
            <Button asChild variant="outline">
              <Link href="/storage/block/snapshots/policies/create">
                Create Snapshot Policies
              </Link>
            </Button>
            <Button asChild>
              <Link href="/storage/block/snapshots/create">
                Create Instant Snapshot
              </Link>
            </Button>
          </div>
        )
      } else if (activeTab === "backup") {
        return (
          <div className="flex items-center gap-3">
            <Button asChild variant="outline">
              <Link href="/storage/block/backup/policies/create">
                Create Backup Policies
              </Link>
            </Button>
            <Button asChild>
              <Link href="/storage/block/backup/create">
                Create Instant Backup
              </Link>
            </Button>
          </div>
        )
      }
    } else {
      // Single button case
      return <CreateButton href={buttonInfo.href} label={buttonInfo.label} />
    }
  }

  return (
    <PageLayout 
      title={title} 
      description={description}
      headerActions={getHeaderActions()}
    >
      <div className="space-y-6">
        <VercelTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          size="lg"
        />

        {activeTab === "volumes" && <VolumesSection />}
        {activeTab === "snapshots" && <SnapshotsSection />}
        {activeTab === "backup" && <BackupSection />}
      </div>
    </PageLayout>
  )
}
