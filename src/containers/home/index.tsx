/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import {
  Cross,
  DiscordFill,
  InstagramFill,
  TelegramFill,
  TwitterFill,
} from "akar-icons";
import Image from "next/image";
import { useEffect, useState } from "react";
// import DiscordFill from "../components/svgs/discord";
import { CONTRACT_ADDRESS, getEtherscanUrl } from "../../constants";
import useContract from "../../hooks/useContract";
import useWallet from "../../hooks/useWallet";

import EtherscanFill from "../../../public/etherscan.svg";
import {
  BACKGROUND_COLOR,
  BUTTON_COLOR,
  BUTTON_TEXT_COLOR,
  COLLECTION_DESCRIPTION,
  COLLECTION_NAME,
  COLLECTION_WEBSITE,
  DISCORD_URL,
  HERO_MEDIA,
  INSTAGRAM_URL,
  LOGO_MEDIA,
  SHOW_TIMER,
  SHOW_TOKENS_CLAIMED,
  SHOW_TOTAL_TOKENS,
  TELEGRAM_URL,
  TEXT_COLOR,
  TIMER_TYPE,
  TOKEN_COUNTER_COLOR,
  TWITTER_URL,
} from "../../settings/constants";
import Box from "../../components/Box";
import Mint from "./Mint";
import If from "../../components/If";
import { SIMPLR_URL } from "../../constants";
import { format } from "date-fns";

const condense = (text: string) => {
  return `${text?.substring(0, 5)}...${text?.substring(text.length - 5)}`;
};

const BUTTON_TEXT = {
  MINT_PRESALE: "Mint for Free",
  MINT_SALE: "Mint for ",
  EXCEEDS: "Token exceeds limit",
  TRANSACTION: "Confirm Transaction",
  MINTING: "Minting...",
  SOLD_OUT: "Sold Out",
  PRESALE_NOT_ALLOWED: "Not Allowed to Buy",
  NO_SALE: "Coming Soon, Stay Tuned",
};

const HomeContainer = () => {
  const [connected, setConnected] = useState(false);
  const [user, provider, signer, connectWallet] = useWallet();
  const [totalSupply, setTotalSupply] = useState<number>();
  const [maximumTokens, setMaximumTokens] = useState<number>();
  const [publicSaleStartTime, setPublicSaleStartTime] = useState<number>(0);
  const [presaleStartTime, setPresaleStartTime] = useState<number>(0);
  const [contract] = useContract(CONTRACT_ADDRESS, provider);
  const [expandedImage, setExpandedImage] = useState(false);

  useEffect(() => {
    const getSupply = async () => {
      try {
        const tokens = await contract.callStatic.totalSupply();
        setTotalSupply(tokens);
      } catch (err) {
        console.log(err, "error in fetch total supply");
      }
    };

    const getInformation = async () => {
      try {
        getSupply();
        const maxSupply = await contract.callStatic.maximumTokens();
        setMaximumTokens(maxSupply);
      } catch (err) {
        console.log(err, "Error in fetching max Supply");
      }
      try {
        const publicSaleTime = await contract.callStatic.publicSaleStartTime();
        setPublicSaleStartTime(publicSaleTime);
        const preSaleTime = await contract.callStatic.presaleStartTime();
        setPresaleStartTime(publicSaleTime);
      } catch (err) {
        console.log(err, "Error in fetching public sale start time");
      }
    };

    if (contract) {
      try {
        getInformation();
        setInterval(() => {
          getSupply();
        }, 5000);
      } catch (err) {
        console.log(err);
      }
    }
  }, [contract]);

  useEffect(() => {
    if (user) {
      setConnected(true);
    }
  }, [user]);

  const incrementSupply = (quantity: number) => {
    setTotalSupply(totalSupply + quantity);
  };

  const handleExpand = (e) => {
    e.preventDefault();
    setExpandedImage(true);
  };

  const handleClose = (e) => {
    e.preventDefault();
    setExpandedImage(false);
  };

  return (
    <Box
      className="container"
      backgroundColor={BACKGROUND_COLOR}
      pt="4rem"
      position="relative"
      pb={connected ? "10rem" : "0"}
    >
      <Box
        maxWidth="128rem"
        m="auto"
        display="flex"
        justifyContent="space-between"
        className="navbar"
      >
        <Box className="logo-cont">
          <a href={COLLECTION_WEBSITE} rel="noreferrer">
            <Box
              position="relative"
              width="32.8rem"
              height="5rem"
              css={`
                @media screen and (max-width: 768px) {
                  height: 64px;
                  width: 20vw;
                }
              `}
            >
              <Image
                src={LOGO_MEDIA}
                alt="logo"
                layout="fill"
                objectFit="contain"
              />
            </Box>
          </a>
        </Box>
        <Box
          display="flex"
          flex={1}
          flexDirection="row"
          justifyContent="flex-end"
          css={`
            @media screen and (max-width: 768px) {
              width: 150px;
            }
          `}
          className="icon-box"
          maxWidth="30rem"
        >
          <Box
            as="a"
            href={getEtherscanUrl()}
            rel="noreferrer"
            target="_blank"
            className="icon icon-eth"
            color={TEXT_COLOR}
            display="flex"
            justifyContent="center"
            height="64px"
            width="64px"
          >
            <EtherscanFill color={TEXT_COLOR} />
          </Box>
          <If
            condition={!!TWITTER_URL}
            then={
              <a
                href={TWITTER_URL}
                target="_blank"
                rel="noreferrer"
                className="icon"
              >
                <TwitterFill color={TEXT_COLOR} size={48} />
              </a>
            }
          />
          <If
            condition={!!DISCORD_URL}
            then={
              <Box
                as="a"
                href={DISCORD_URL}
                target="_blank"
                rel="noreferrer"
                className="icon"
              >
                <DiscordFill color={TEXT_COLOR} size={48} />
              </Box>
            }
          />
          <If
            condition={!!INSTAGRAM_URL}
            then={
              <Box
                as="a"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="icon"
              >
                <InstagramFill color={TEXT_COLOR} size={48} />
              </Box>
            }
          />
          <If
            condition={!!TELEGRAM_URL}
            then={
              <Box
                as="a"
                href={TELEGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="icon"
              >
                <TelegramFill color={TEXT_COLOR} />
              </Box>
            }
          />
        </Box>
      </Box>
      <Box className="hero">
        <Box
          className="hero-media"
          onClick={handleExpand}
          height={expandedImage ? "100vh" : { mobS: "20rem", tabS: "30rem" }}
          width={expandedImage ? "100vw" : { mobS: "20rem", tabS: "30rem" }}
          position={expandedImage ? "absolute" : "relative"}
          borderRadius="8px"
          overflow="hidden"
          top="0"
          backgroundColor={expandedImage ? BACKGROUND_COLOR : "none"}
        >
          <Image
            alt="hero g-smif"
            src={HERO_MEDIA}
            layout="fill"
            className="hero-gif"
            quality="1"
            objectFit="contain"
          />
          <If
            condition={expandedImage}
            then={
              <Box
                display="flex"
                alignItems="center"
                ml="mm"
                cursor="pointer"
                zIndex="20"
                onClick={handleClose}
                width="100px"
              >
                <Cross />
                <Box as="h2" fontSize="1.6rem" ml="mxs" color={TEXT_COLOR}>
                  Close
                </Box>
              </Box>
            }
          />
        </Box>
        <Box as="h1" id="hero-text" color={TEXT_COLOR}>
          {COLLECTION_NAME}
        </Box>
        {COLLECTION_DESCRIPTION.map((description) => (
          <Box as="h5" id="desc-text" color={TEXT_COLOR} key={description[0]}>
            {description}
          </Box>
        ))}
        {connected && SHOW_TOKENS_CLAIMED ? (
          <Box
            as="h3"
            id="counter"
            fontSize="1.8rem"
            color={TOKEN_COUNTER_COLOR}
          >
            {SHOW_TOTAL_TOKENS
              ? `Tokens Claimed: ${totalSupply}/${maximumTokens}`
              : `Tokens Claimed: ${totalSupply}`}
          </Box>
        ) : null}
        {connected && SHOW_TIMER ? (
          <Timer
            timestamp={
              TIMER_TYPE === "END" ? publicSaleStartTime : presaleStartTime
            }
            type={TIMER_TYPE}
          />
        ) : null}
      </Box>
      <Box className="mint-section">
        {!connected ? (
          <Box
            as="button"
            className="connect-btn"
            onClick={() => connectWallet()}
            style={{ backgroundColor: BUTTON_COLOR, color: BUTTON_TEXT_COLOR }}
          >
            Connect Wallet
          </Box>
        ) : (
          <Box>
            <Mint
              provider={provider}
              signer={signer}
              user={user}
              incrementSupply={incrementSupply}
            />
            <Box
              as="h3"
              className="user-address"
              fontSize="2rem"
              color={TEXT_COLOR}
              fontWeight={400}
              lineHeight="120%"
              m="0"
              textAlign="center"
              zIndex={3}
            >
              Connected to:{" "}
              <Box as="span" className="address" color={BUTTON_COLOR}>
                {condense(user)}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      <div className="simplr">
        <a href={SIMPLR_URL} target="_blank" rel="noreferrer">
          <Image
            src="/simplr_brand.svg"
            height={41}
            width={167}
            alt="simplr brand"
          />
        </a>
      </div>
    </Box>
  );
};

export default HomeContainer;

interface TimerProps {
  timestamp: number;
  type: "START" | "END";
}

const DAY_SECONDS = 86400;
const HOUR_SECONDS = 3600;
const MINUTE_SECONDS = 60;

const Timer = ({ timestamp, type }: TimerProps) => {
  const [value, setValue] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = timestamp - now;
      if (remaining > DAY_SECONDS) {
        const days = Math.floor(remaining / DAY_SECONDS);
        const hours = Math.floor(
          (remaining - DAY_SECONDS * days) / HOUR_SECONDS
        );
        const minutes = Math.floor(
          (remaining - DAY_SECONDS * days - hours * HOUR_SECONDS) /
            MINUTE_SECONDS
        );
        const seconds = Math.floor(
          remaining -
            DAY_SECONDS * days -
            hours * HOUR_SECONDS -
            minutes * MINUTE_SECONDS
        );
        const countdown = `${days < 10 ? 0 : ""}${days}:${
          hours < 10 ? 0 : ""
        }${hours}:${minutes < 10 ? 0 : ""}${minutes}:${
          seconds < 10 ? 0 : ""
        }${seconds}`;

        setValue(countdown);
      } else {
        const hours = Math.floor(remaining / HOUR_SECONDS);
        const minutes = Math.floor(
          (remaining - hours * HOUR_SECONDS) / MINUTE_SECONDS
        );
        const seconds = Math.floor(
          remaining - hours * HOUR_SECONDS - minutes * MINUTE_SECONDS
        );
        const countdown = `${hours < 10 ? 0 : ""}${hours}:${
          minutes < 10 ? 0 : ""
        }${minutes}:${seconds < 10 ? 0 : ""}${seconds}`;
        setValue(countdown);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timestamp]);

  if (!!value) {
    return (
      <Box as="h3" fontSize="1.8rem" color={TEXT_COLOR}>{`Minting ${
        type === "START" ? "Starts" : "Ends"
      } in ${value}`}</Box>
    );
  }
  return null;
};
