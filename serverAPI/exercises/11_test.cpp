#include <gtest/gtest.h>
#include <fstream>
#include <cstdlib>

TEST(MediaPonderadaTest, OutputTest)
{
    system("echo '7 8 9\n2 3 5' | /tmp/code_exec > saida.txt");
    std::ifstream saida("saida.txt");
    std::string linha;
    while (std::getline(saida, linha))
    {
        if (linha.find("Media ponderada:") != std::string::npos)
            break;
    }
    EXPECT_EQ(linha, "Media ponderada: 8.3");
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
